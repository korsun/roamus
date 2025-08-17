const SvgTime = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.size}
    height={props.size}
    {...props}
  >
    <path
      fill="#3939aa"
      d="M16 19.82a1.5 1.5 0 0 1-1.5-1.5V14a1.5 1.5 0 0 1 3 0v4.36a1.5 1.5 0 0 1-1.5 1.46Z"
    />
    <path
      fill="#3939aa"
      d="M16 29.5a11.18 11.18 0 1 1 11.18-11.18A11.2 11.2 0 0 1 16 29.5Zm0-19.36a8.18 8.18 0 1 0 8.18 8.18A8.19 8.19 0 0 0 16 10.14Z"
    />
    <path
      fill="#3939aa"
      d="M18.82 5.5h-5.64a1.5 1.5 0 0 1 0-3h5.64a1.5 1.5 0 0 1 0 3zm4.37 7.13a1.5 1.5 0 0 1-1.06-2.56l2.49-2.49a1.5 1.5 0 0 1 2.12 2.12l-2.49 2.49a1.49 1.49 0 0 1-1.06.44z"
    />
  </svg>
);
export default SvgTime;
