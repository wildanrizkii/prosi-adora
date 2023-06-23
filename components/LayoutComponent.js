import { useState } from "react";
import { useRouter } from "next/router";
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

  function handleClick() {
    if (atas !== undefined) {
      router.push("/" + atas + "/" + nama.replaceAll(" ", ""));
    } else {
      router.push("/" + nama.replaceAll(" ", ""));
    }
  }
  return (
    <li style={{ marginBottom: 10, marginLeft: 10 }}>
      <a onClick={onClick ? onClick : handleClick}>
        <i className={icon} style={{ marginRight: "5px" }} />
        {nameStyle}
      </a>
    </li>
  );
}

export function MenuWithDropdown({ nama, clickedMenu, dropdown, icon }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const ClickHandler = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const pemetaanDropdown = dropdown.map((x) => {
    console.log(x.icon);
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
        <i className={icon} style={{ marginRight: "5px" }} />
        {nama}
      </a>

      {isDropdownOpen && <ul>{pemetaanDropdown}</ul>}
    </li>
  );
}
