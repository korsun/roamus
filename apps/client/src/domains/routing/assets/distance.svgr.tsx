const SvgDistance = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.size}
    height={props.size}
    fill="none"
    {...props}
  >
    <path
      fill="#443C67"
      fillRule="evenodd"
      d="M20.37 10.34C21.528 8.81 23 6.503 23 4.668 23 2.642 21.21 1 19 1s-4 1.642-4 3.667c0 1.835 1.472 4.142 2.63 5.674a1.696 1.696 0 0 0 2.74 0ZM19 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm-3.793 2.793a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414-1.414l4-4a1 1 0 0 1 1.414 0ZM9 16.667c0 1.835-1.472 4.142-2.63 5.673a1.697 1.697 0 0 1-2.74 0C2.472 20.81 1 18.502 1 16.667 1 14.642 2.79 13 5 13s4 1.642 4 3.667ZM6 17a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgDistance;
