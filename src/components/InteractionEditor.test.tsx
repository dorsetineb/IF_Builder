import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import InteractionEditor from './InteractionEditor';
import { Interaction, Scene } from '../types';

describe('InteractionEditor Transition and Speed Controls', () => {
  const mockInteractions: Interaction[] = [
    {
      id: 'inter_1',
      title: 'Abrir porta de ferro',
      verbs: ['abrir', 'destrancar'],
      target: 'obj_porta',
      goToScene: 'scn_2',
      transitionType: 'fade',
      transitionSpeed: 4,
    },
  ];

  const mockScenes: Scene[] = [
    {
      id: 'scn_1',
      name: 'Entrada',
      image: '',
      description: 'Entrada',
      objectIds: ['obj_porta'],
      interactions: mockInteractions,
    },
    {
      id: 'scn_2',
      name: 'Salão Principal',
      image: '',
      description: 'Salão',
      objectIds: [],
      interactions: [],
    },
  ];

  it('renders transition selector and speed slider in the interaction editor', () => {
    const onUpdateInteractions = vi.fn();

    render(
      <InteractionEditor
        interactions={mockInteractions}
        onUpdateInteractions={onUpdateInteractions}
        allScenes={mockScenes}
        currentSceneId="scn_1"
        sceneObjects={[{ id: 'obj_porta', name: 'Porta de Ferro', examineDescription: '', isTakable: false }]}
        allTakableObjects={[]}
        consequenceTrackers={[]}
        vignettes={[]}
      />
    );

    // Verify transition dropdown is rendered with current value
    const transitionSelect = screen.getByDisplayValue(/Esmaecer|Fade/i);
    expect(transitionSelect).toBeInTheDocument();

    // Verify speed label and value
    expect(screen.getByText(/Rápido|Fast/i)).toBeInTheDocument();
  });

  it('triggers onUpdateInteractions when transition or speed is changed', () => {
    const onUpdateInteractions = vi.fn();

    render(
      <InteractionEditor
        interactions={mockInteractions}
        onUpdateInteractions={onUpdateInteractions}
        allScenes={mockScenes}
        currentSceneId="scn_1"
        sceneObjects={[{ id: 'obj_porta', name: 'Porta de Ferro', examineDescription: '', isTakable: false }]}
        allTakableObjects={[]}
        consequenceTrackers={[]}
        vignettes={[]}
      />
    );

    const transitionSelect = screen.getByDisplayValue(/Esmaecer|Fade/i);
    fireEvent.change(transitionSelect, { target: { value: 'slide-left' } });

    expect(onUpdateInteractions).toHaveBeenCalledWith([
      expect.objectContaining({
        id: 'inter_1',
        transitionType: 'slide-left',
      }),
    ]);

    fireEvent.change(transitionSelect, { target: { value: 'zoom' } });

    expect(onUpdateInteractions).toHaveBeenCalledWith([
      expect.objectContaining({
        id: 'inter_1',
        transitionType: 'zoom',
      }),
    ]);
  });
});
