export type SvgCadLineType = 'default' | 'dotted'

interface SvgCadStrokeOptions {
  type?: SvgCadLineType
  stroke?: string
  strokeWidth?: number
  strokeDasharray?: string
  active?: boolean
  activeStroke?: string
}

const strokeDefaults: Record<
  SvgCadLineType,
  Required<Pick<SvgCadStrokeOptions, 'stroke' | 'strokeWidth'>> & {
    strokeDasharray?: string
  }
> = {
  default: {
    stroke: '#013675',
    strokeWidth: 3,
  },
  dotted: {
    stroke: '#797060',
    strokeWidth: 1.5,
    strokeDasharray: '5 5',
  },
}

export const resolveSvgCadStroke = (options: SvgCadStrokeOptions) => {
  const defaults = strokeDefaults[options.type ?? 'default']

  return {
    stroke:
      options.active && options.activeStroke
        ? options.activeStroke
        : (options.stroke ?? defaults.stroke),
    strokeWidth: options.strokeWidth ?? defaults.strokeWidth,
    strokeDasharray: options.strokeDasharray ?? defaults.strokeDasharray,
  }
}
