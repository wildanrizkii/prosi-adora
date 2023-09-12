import { useState } from "react";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
export function ImageOfAdora() {
  return (
    <li>
      <figure className="image is-64x64" style={{ marginLeft: 60 }}>
        <img src="/image/Logo ADORA.jpg" alt="Logo Apotik Adora" />
      </figure>
    </li>
  );
}

export function Menu({ nama, clickedMenu, onClick, atas, icon }) {
  const router = useRouter();
  const nameStyle =
    clickedMenu === nama.split("?")[0] ? (
      <span style={{ color: "green" }}>{nama.split("?")[0]}</span>
    ) : (
      nama.split("?")[0]
    );
  const bgColor = clickedMenu === nama.split("?")[0] ? "#f5f5f5" : "white";
  function handleClick() {
    if (atas !== undefined) {
      router.push("/" + atas + "/" + nama.replaceAll(" ", ""));
    } else {
      router.push("/" + nama.replaceAll(" ", ""));
    }
  }
  return (
    <li style={{ marginBottom: 10, marginLeft: 10, backgroundColor: bgColor }}>
      <a onClick={onClick ? onClick : handleClick}>
        <FontAwesomeIcon icon={icon} style={{ marginRight: "5px" }} />
        {nameStyle}
      </a>
    </li>
  );
}

export function MenuWithDropdown({ nama, clickedMenu, dropdown, icon }) {
  let bool = false;
  for (let i = 0; i < dropdown.length; i++) {
    if (dropdown[i].nama.split("?")[0] === clickedMenu) {
      bool = true;
      break;
    }
  }
  const [isDropdownOpen, setIsDropdownOpen] = useState(bool);
  const ClickHandler = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const pemetaanDropdown = dropdown.map((x) => {
    return (
      <Menu
        nama={x.nama}
        key={x.nama}
        clickedMenu={clickedMenu}
        atas={nama}
        icon={x.icon}
      ></Menu>
    );
  });
  return (
    <li style={{ marginBottom: 10, marginLeft: 10 }}>
      <a onClick={ClickHandler}>
        <FontAwesomeIcon icon={icon} style={{ marginRight: "5px" }} />
        {nama}
      </a>

      {isDropdownOpen && <ul>{pemetaanDropdown}</ul>}
    </li>
  );
}
