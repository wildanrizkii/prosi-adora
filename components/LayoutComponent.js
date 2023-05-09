import { useState } from "react";
import { useRouter } from "next/router";
export function ImageOfAdora() {
  return (
    <li>
      <figure className="image is-64x64" style={{ marginLeft: 60 }}>
        <img src="/Logo ADORA.jpg" alt="Logo Apotik Adora" />
      </figure>
    </li>
  );
}

export function Menu({ nama, clickedMenu }) {
  const router = useRouter();
  const nameStyle =
    clickedMenu === nama ? (
      <span style={{ color: "green" }}>{nama}</span>
    ) : (
      nama
    );

  function handleClick() {
    router.replace("/" + nama.replaceAll(" ", ""));
  }
  return (
    <li style={{ marginBottom: 10, marginLeft: 10 }}>
      <a onClick={handleClick}>{nameStyle}</a>
    </li>
  );
}

export function MenuWithDropdown({ nama, clickedMenu, dropdown }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const ClickHandler = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const pemetaanDropdown = dropdown.map((x) => {
    return <Menu nama={x} key={x} clickedMenu={clickedMenu}></Menu>;
  });
  return (
    <li style={{ marginBottom: 10, marginLeft: 10 }}>
      <a onClick={ClickHandler}>{nama}</a>

      {isDropdownOpen && <ul>{pemetaanDropdown}</ul>}
    </li>
  );
}
