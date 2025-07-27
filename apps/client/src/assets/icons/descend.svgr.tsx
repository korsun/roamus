const SvgDescend = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.size}
    height={props.size}
    {...props}
  >
    <g color="#000">
      <path
        fill="#cad1d8"
        d="m-525 1402.362-10-13h5v-15h10v15h5l-10 13z"
        overflow="visible"
        style={{
          isolation: 'auto',
          mixBlendMode: 'normal',
        }}
        transform="translate(541 -1372.362)"
      />
      <path
        fill="#25b39e"
        d="m-525 1402.362-10-13h5v-7h10v7h5z"
        overflow="visible"
        style={{
          isolation: 'auto',
          mixBlendMode: 'normal',
        }}
        transform="translate(541 -1372.362)"
      />
    </g>
  </svg>
);
export default SvgDescend;
