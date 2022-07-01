export type SvgProps = Parameters<typeof generateAvatar>

export function generateAvatar({
  text = 'AB',
  round = true,
  size = 60,
  bg = '#eee',
  color = '#ffffff',
  fontSize = 0.4,
}) {
  const sizeStyle = { width: size, height: size }
  const textStyle = { color, lineHeight: 1, fontFamily: "-apple-system, BlinkMacSystemFont, 'Roboto', 'Ubuntu', 'Helvetica Neue', sans-serif" }

  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="dark:fill-white fill-gray-500" style={sizeStyle} viewBox={`0 0 ${size} ${size}`} version="1.1" >
      {round ?
        <circle style={sizeStyle} cx={size / 2} cy={size / 2} r={size / 2} /> :
        <rect style={sizeStyle} cx={size / 2} cy={size / 2} r={size / 2} rx={size / 6} ry={size / 6} />}

      <text x="50%" y="50%" style={textStyle}
        alignmentBaseline="middle" textAnchor="middle" fontSize={Math.round(size * fontSize)} fontWeight="normal"
        dy=".1em" dominantBaseline="middle" className="dark:fill-black fill-white" >
        {text}
      </text>
    </svg>
  )
}
