import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { SceneSelectOptions, groupScenesByType, getSceneDisplayName } from './SceneSelectOptions';
import { Scene } from '../../types';

describe('SceneSelectOptions & scene grouping utilities', () => {
  const mockScenes: Scene[] = [
    {
      id: 'scn_opening',
      name: 'Abertura Hotel',
      image: '',
      description: 'Vinheta de abertura',
      objectIds: [],
      interactions: [],
      vignetteType: 'opening',
    },
    {
      id: 'scn_branch_1',
      name: 'Quarto Escuro',
      image: '',
      description: 'Uma ramificação',
      objectIds: [],
      interactions: [],
      vignetteType: 'none',
      sceneType: 'branch',
    },
    {
      id: 'scn_branch_unnamed',
      name: '',
      image: '',
      description: 'Sem nome',
      objectIds: [],
      interactions: [],
      vignetteType: 'none',
    },
    {
      id: 'scn_scenario_1',
      name: 'Espelho Interativo',
      image: '',
      description: 'Cenário com vistas',
      objectIds: [],
      interactions: [],
      sceneType: 'hypercard_stack',
    },
    {
      id: 'scn_scenario_unnamed',
      name: '   ',
      image: '',
      description: 'Cenário sem nome',
      objectIds: [],
      interactions: [],
      sceneType: 'hypercard_stack',
    },
    {
      id: 'scn_chapter_1',
      name: 'Capítulo 2',
      image: '',
      description: 'Transição',
      objectIds: [],
      interactions: [],
      vignetteType: 'transition',
    },
  ];

  it('correctly groups scenes into scenarios, branches, chapters, and openings', () => {
    const grouped = groupScenesByType(mockScenes);

    expect(grouped.openings.map((s) => s.id)).toEqual(['scn_opening']);
    expect(grouped.branches.map((s) => s.id)).toEqual(['scn_branch_1', 'scn_branch_unnamed']);
    expect(grouped.scenarios.map((s) => s.id)).toEqual(['scn_scenario_1', 'scn_scenario_unnamed']);
    expect(grouped.chapters.map((s) => s.id)).toEqual(['scn_chapter_1']);
  });

  it('excludes the current scene ID if excludeSceneId is provided', () => {
    const grouped = groupScenesByType(mockScenes, 'scn_opening');

    expect(grouped.openings).toHaveLength(0);
    expect(grouped.scenarios).toHaveLength(2);
    expect(grouped.branches).toHaveLength(2);
  });

  it('generates fallback names when scene name is blank or whitespace', () => {
    const fakeT = ((key: string, fallback: string) => fallback || key) as any;

    const namedScenario = getSceneDisplayName(mockScenes[3], fakeT, true);
    expect(namedScenario).toBe('Espelho Interativo (scn_scenario_1)');

    const unnamedScenario = getSceneDisplayName(mockScenes[4], fakeT, true);
    expect(unnamedScenario).toBe('Cenário (scn_scenario_unnamed)');

    const unnamedBranch = getSceneDisplayName(mockScenes[2], fakeT, true);
    expect(unnamedBranch).toBe('Ramificação (scn_branch_unnamed)');
  });

  it('renders optgroups for each populated category inside a select', () => {
    render(
      <select data-testid="target-select">
        <option value="">(Fechar)</option>
        <SceneSelectOptions allScenes={mockScenes} excludeSceneId="scn_opening" showId={true} />
      </select>
    );

    const select = screen.getByTestId('target-select');
    expect(select).toBeInTheDocument();

    const options = screen.getAllByRole('option');
    // 1 default close + 2 scenarios + 2 branches + 1 chapter = 6
    expect(options).toHaveLength(6);

    expect(screen.getByText('Espelho Interativo (scn_scenario_1)')).toBeInTheDocument();
    expect(screen.getByText('Cenário (scn_scenario_unnamed)')).toBeInTheDocument();
    expect(screen.getByText('Quarto Escuro (scn_branch_1)')).toBeInTheDocument();
    expect(screen.getByText('Capítulo 2 (scn_chapter_1)')).toBeInTheDocument();
  });
});
