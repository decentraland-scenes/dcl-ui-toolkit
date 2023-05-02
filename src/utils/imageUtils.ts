export type ImageAtlasData = {
  atlasWidth: number;
  atlasHeight: number;
  sourceWidth: number;
  sourceHeight: number;
  sourceLeft: number;
  sourceTop: number;
}

export function getImageAtlasMapping(data?: ImageAtlasData): number[] {
  if (!data) return []

  const {
    atlasWidth,
    atlasHeight,
    sourceWidth,
    sourceHeight,
    sourceTop,
    sourceLeft,
  } = data

  return [
    sourceLeft / atlasWidth, (atlasHeight - sourceTop - sourceHeight) / atlasHeight,
    sourceLeft / atlasWidth, (atlasHeight - sourceTop) / atlasHeight,
    (sourceLeft + sourceWidth) / atlasWidth, (atlasHeight - sourceTop) / atlasHeight,
    (sourceLeft + sourceWidth) / atlasWidth, (atlasHeight - sourceTop - sourceHeight) / atlasHeight,
  ]
}