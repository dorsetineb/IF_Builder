
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        // 1. Authenticate user
        const authHeader = req.headers.get('Authorization')
        if (!authHeader) {
            throw new Error('Missing Authorization header')
        }

        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: authHeader } } }
        )

        const {
            data: { user },
        } = await supabaseClient.auth.getUser()

        if (!user) {
            throw new Error('Unauthorized')
        }

        // 2. Generate functionality
        const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No visually ambiguous chars like I, 1, O, 0
        let code = '';
        for (let i = 0; i < 8; i++) {
            code += characters.charAt(Math.floor(Math.random() * characters.length));
        }

        // 3. Admin Client for DB insert (bypass RLS if needed, or strictly use auth context)
        // Using service role key is safer for backend operations but we must check permissions manually if not using RLS.
        // However, keeping it simple: use the user's client if RLS allows insert.
        // Assuming RLS allows authenticated users to create invites.

        // NOTE: To ensure the code is unique, we could check, but collision probability is low for small scale. 
        // Let's rely on DB constraint or simple insert.

        const { error: insertError } = await supabaseClient
            .from('invites')
            .insert({
                code: code,
                created_by: user.id,
                uses: 1 // Default to 1 usage per invite if not specified
            })

        if (insertError) throw insertError

        // 4. Return the code
        return new Response(
            JSON.stringify({ code }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            }
        )

    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            }
        )
    }
})
