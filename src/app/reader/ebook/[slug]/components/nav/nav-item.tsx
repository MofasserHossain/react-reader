const NavItem = ({ message, onClick }: Props) => {
  return (
    <div onClick={onClick}>
      <span>{message}</span>
    </div>
  )
}

// const Content = styled.button`
//   width: 100%;
//   height: 48px;
//   box-sizing: border-box;
//   padding: 12px 24px;
//   display: flex;
//   align-items: center;
//   cursor: pointer;
//   background-color: ${palette.gray0};
//   outline: none;

//   & > span {
//     transition: 0.2s 1;
//     font-size: 14px;
//   }

//   &:focus,
//   &:hover {
//     & > span {
//       color: ${palette.blue3};
//       margin-left: 12px;
//     }
//   }

//   &:last-child {
//     margin-bottom: 32px;
//   }
// `

interface Props {
  message: string
  onClick: () => void
}

export default NavItem
