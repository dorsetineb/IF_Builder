import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { Scene } from '../../types';

export interface GroupedScenes {
  scenarios: Scene[];
  branches: Scene[];
  chapters: Scene[];
  openings: Scene[];
}

export const groupScenesByType = (scenes: Scene[], excludeSceneId?: string): GroupedScenes => {
  const filtered = excludeSceneId ? scenes.filter(s => s && s.id !== excludeSceneId) : scenes.filter(Boolean);

  const scenarios: Scene[] = [];
  const branches: Scene[] = [];
  const chapters: Scene[] = [];
  const openings: Scene[] = [];

  for (const s of filtered) {
    if (s.sceneType === 'hypercard_stack') {
      scenarios.push(s);
    } else if (s.vignetteType === 'opening') {
      openings.push(s);
    } else if (s.vignetteType && s.vignetteType !== 'none') {
      chapters.push(s);
    } else {
      branches.push(s);
    }
  }

  return { scenarios, branches, chapters, openings };
};

export const getSceneDisplayName = (s: Scene, t: TFunction, showId: boolean = true): string => {
  let baseName = s.name?.trim();
  if (!baseName) {
    if (s.sceneType === 'hypercard_stack') {
      baseName = t('sceneEditor.defaultScenarioName', 'Cenário');
    } else if (s.vignetteType === 'opening') {
      baseName = t('sceneEditor.defaultOpeningName', 'Abertura');
    } else if (s.vignetteType && s.vignetteType !== 'none') {
      baseName = t('sceneEditor.defaultChapterName', 'Capítulo');
    } else {
      baseName = t('sceneEditor.defaultSceneName', 'Ramificação');
    }
  }
  return showId ? `${baseName} (${s.id})` : baseName;
};

export interface SceneSelectOptionsProps {
  allScenes: Scene[];
  excludeSceneId?: string;
  showId?: boolean;
}

export const SceneSelectOptions: React.FC<SceneSelectOptionsProps> = ({
  allScenes,
  excludeSceneId,
  showId = true,
}) => {
  const { t } = useTranslation();

  const grouped = useMemo(
    () => groupScenesByType(allScenes || [], excludeSceneId),
    [allScenes, excludeSceneId]
  );

  return (
    <>
      {grouped.scenarios.length > 0 && (
        <optgroup label={t('sceneEditor.scenariosGroup', 'Cenários')}>
          {grouped.scenarios.map((s) => (
            <option key={s.id} value={s.id}>
              {getSceneDisplayName(s, t, showId)}
            </option>
          ))}
        </optgroup>
      )}

      {grouped.branches.length > 0 && (
        <optgroup label={t('sceneEditor.branchesGroup', 'Ramificações')}>
          {grouped.branches.map((s) => (
            <option key={s.id} value={s.id}>
              {getSceneDisplayName(s, t, showId)}
            </option>
          ))}
        </optgroup>
      )}

      {grouped.chapters.length > 0 && (
        <optgroup label={t('sceneEditor.chaptersGroup', 'Capítulos')}>
          {grouped.chapters.map((s) => (
            <option key={s.id} value={s.id}>
              {getSceneDisplayName(s, t, showId)}
            </option>
          ))}
        </optgroup>
      )}

      {grouped.openings.length > 0 && (
        <optgroup label={t('sceneEditor.openingGroup', 'Abertura')}>
          {grouped.openings.map((s) => (
            <option key={s.id} value={s.id}>
              {getSceneDisplayName(s, t, showId)}
            </option>
          ))}
        </optgroup>
      )}
    </>
  );
};

export default SceneSelectOptions;
