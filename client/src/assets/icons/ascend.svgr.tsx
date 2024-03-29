const SvgAscend = props => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.size}
    height={props.size}
    {...props}
  >
    <g color="#000">
      <path
        fill="#cad1d8"
        d="m-565 1374.362-10 13h5v15h10v-15h5l-10-13z"
        overflow="visible"
        style={{
          isolation: 'auto',
          mixBlendMode: 'normal',
        }}
        transform="translate(581 -1372.362)"
      />
      <path
        fill="#f05542"
        d="m-571.25 1382.487-1.25 1.625-2.5 3.25h5v15h10v-15h5l-2.5-3.25-1.25-1.625z"
        overflow="visible"
        style={{
          isolation: 'auto',
          mixBlendMode: 'normal',
        }}
        transform="translate(581 -1372.362)"
      />
    </g>
  </svg>
);
export default SvgAscend;
