import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useReducer } from "react";
import { useRouter } from "next/router";
export function Field({
  nama,
  value,
  onChange,
  IconLeft,
  type,
  placeholder,
  field,
  maxLength,
  fungsiCheck,
}) {
  function reducer(state, action) {
    if (action.type === "LOADING") {
      return {
        hasil: (
          <p className="help is-info" style={{ fontSize: "15px" }}>
            loading
          </p>
        ),
        warnaTextbox: "input is-info",
        icon: <FontAwesomeIcon icon="spinner" spin color="blue" />,
      };
    } else if (action.type === "BISA") {
      return {
        hasil: (
          <p className="help is-success" style={{ fontSize: "15px" }}>
            {nama + " tersedia"}
          </p>
        ),
        warnaTextbox: "input is-success",
        icon: <FontAwesomeIcon icon="check" color="green" />,
      };
    } else if (action.type === "TIDAK BISA") {
      return {
        hasil: (
          <p className="help is-danger" style={{ fontSize: "15px" }}>
            {nama + " tidak tersedia"}
          </p>
        ),
        warnaTextbox: "input is-danger",
        icon: <FontAwesomeIcon icon="times" color="red" />,
      };
    } else if (action.type === "TIDAK BOLEH") {
      return {
        hasil: (
          <p className="help is-danger" style={{ fontSize: "15px" }}>
            {nama + " tidak memenuhi ketentuan"}
          </p>
        ),
        warnaTextbox: "input is-danger",
        icon: <FontAwesomeIcon icon="times" color="red" />,
      };
    } else if (action.type === "error") {
      return {
        hasil: (
          <p className="help is-danger" style={{ fontSize: "15px" }}>
            Terjadi masalah saat mengakses database
          </p>
        ),
        warnaTextbox: "input is-danger",
        icon: <FontAwesomeIcon icon="times" color="red" />,
      };
    } else if (action.type === "default") {
      return userinitValue;
    }
  }

  const initialState = {
    warnaTextbox: "input",
    hasil: undefined,
    icon: undefined,
  };
  const [state, dispatch] = useReducer(reducer, initialState);

  const onChangeValueWithFunc = async (e) => {
    console.log(e.target.value);
    onChange({ ...field, [nama]: e.target.value });
    dispatch({ type: "LOADING" });

    try {
      const hasil = await fungsiCheck(e.target.value);
      if (hasil === "BISA") {
        dispatch({ type: "BISA" });
        onChange({
          ...field,
          [nama]: e.target.value,
          [nama + " Checked"]: true,
        });
      } else if (hasil === "TIDAK BISA") {
        dispatch({ type: "TIDAK BISA" });
        onChange({
          ...field,
          [nama]: e.target.value,
          [nama + " Checked"]: false,
        });
      } else if (hasil === "TIDAK BOLEH") {
        dispatch({ type: "TIDAK BOLEH" });
        onChange({
          ...field,
          [nama]: e.target.value,
          [nama + " Checked"]: false,
        });
      }
    } catch (er) {
      dispatch({ type: "error" });
      onChange({
        ...field,
        [nama]: e.target.value,
        [nama + " Checked"]: false,
      });
    }
  };

  const onChangeValue = (e) => {
    onChange({ ...field, [nama]: e.target.value });
  };
  return (
    <div className="field">
      <label className="label">{nama}</label>
      <div className="control has-icons-left has-icons-right">
        <input
          className={state.warnaTextbox}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={
            fungsiCheck !== undefined ? onChangeValueWithFunc : onChangeValue
          }
          maxLength={maxLength}
          required
        />
        <span className="icon is-small is-left">
          {IconLeft !== undefined && <i className={IconLeft}></i>}
        </span>
        <span className="icon is-small is-right">{state.icon}</span>
      </div>
      {state.hasil}
    </div>
  );
}

export function Dropdown({
  nama,
  value,
  onChange,
  arr,
  field,
  mappingElement,
  placeholder,
}) {
  const onChangeValue = (e) => {
    onChange({ ...field, [nama]: e.target.value });
  };
  const isiOption = arr.map((element) => {
    if (mappingElement === undefined) {
      return (
        <option key={element} value={element}>
          {element}
        </option>
      );
    } else {
      return (
        <option
          key={element[mappingElement[0]]}
          value={element[mappingElement[0]]}
        >
          {element[mappingElement[1]]}
        </option>
      );
    }
  });

  return (
    <div className="field">
      <label className="label">{nama}</label>
      <div className="control">
        <div className="select">
          <select onChange={onChangeValue} value={value}>
            {placeholder !== undefined && (
              <option key="placeholder" value="" disabled>
                {placeholder}
              </option>
            )}
            {isiOption}
          </select>
        </div>
      </div>
    </div>
  );
}

export function Modal({ children, show }) {
  return (
    <div className={`modal ${show !== undefined && show}`}>
      <div className="modal-background" />
      <div className="modal-content">{children}</div>
    </div>
  );
}

export function IsiModalSuccess({ pesan, children }) {
  return (
    <article className="message">
      <div
        className="message-body"
        style={{ fontSize: "25px", textAlign: "center", color: "green" }}
      >
        {pesan}
      </div>
      <div style={{ textAlign: "center", padding: "10px" }}>{children}</div>
    </article>
  );
}

export function IsiModalFailed({ pesan, children }) {
  return (
    <article className="message">
      <div
        className="message-body"
        style={{ fontSize: "25px", textAlign: "center", color: "red" }}
      >
        {pesan}
      </div>
      <div style={{ textAlign: "center", padding: "10px" }}>{children}</div>
    </article>
  );
}

export function Pagination({ href, currentPage, jumlah }) {
  const bagiDua = href.split("?");
  const hrefDepan = bagiDua[0];
  const hrefBelakang = new URLSearchParams(bagiDua[1]);

  const currPage = parseInt(currentPage);
  const last = Math.ceil(parseInt(jumlah) / 10);
  const prev = currPage - 1;
  const next = currPage + 1;
  let arr = [];
  function Add(number) {
    if (number >= 1 && number <= last) {
      arr.push(number);
    }
  }

  Add(1);
  Add(prev - 1);
  Add(prev);
  Add(currPage);
  Add(next);
  Add(next + 1);
  Add(last);

  const uniq = [...new Set(arr)];
  const Router = useRouter();
  const elipsisKiri = !(uniq.includes(2) || last === 1);
  const elipsisKanan = !(uniq.includes(last - 1) || last === 1);

  return (
    <nav
      className="pagination is-centered"
      role="navigation"
      aria-label="pagination"
    >
      <button
        className="button pagination-previous"
        disabled={prev === 0 && true}
        onClick={() => {
          hrefBelakang.set("p", prev);
          console.log(hrefBelakang.toString());
          Router.push(hrefDepan + "?" + hrefBelakang.toString());
        }}
      >
        Previous
      </button>
      <button
        className="button pagination-next"
        onClick={() => {
          hrefBelakang.set("p", next);
          Router.push(hrefDepan + "?" + hrefBelakang.toString());
        }}
        disabled={next > last && true}
      >
        Next page
      </button>
      <ul className="pagination-list">
        {uniq.map((el, index) => {
          return (
            <>
              {index === 1 && elipsisKiri === true ? (
                <li key="elipsis-kiri">
                  <span className="pagination-ellipsis">…</span>
                </li>
              ) : undefined}
              {index === uniq.length - 1 && elipsisKanan === true ? (
                <li key="elipsis-kanan">
                  <span className="pagination-ellipsis">…</span>
                </li>
              ) : undefined}

              <li key={el}>
                <button
                  className={`button pagination-link ${
                    el === currPage && "is-current"
                  }`}
                  aria-label={`Goto page ${el}`}
                  onClick={() => {
                    hrefBelakang.set("p", el);
                    Router.push(hrefDepan + "?" + hrefBelakang.toString());
                  }}
                >
                  {el}
                </button>
              </li>
            </>
          );
        })}
      </ul>
    </nav>
  );
}

export function FieldKhusus({
  nama,
  value,
  onChange,
  IconLeft,
  type,
  placeholder,
  field,
  maxLength,
  fungsiCheck,
  id,
}) {
  function reducer(state, action) {
    if (action.type === "LOADING") {
      return {
        hasil: (
          <p className="help is-info" style={{ fontSize: "15px" }}>
            loading
          </p>
        ),
        warnaTextbox: "input is-info",
        icon: <FontAwesomeIcon icon="spinner" spin color="blue" />,
      };
    } else if (action.type === "BISA") {
      return {
        hasil: (
          <p className="help is-success" style={{ fontSize: "15px" }}>
            {nama + " tersedia"}
          </p>
        ),
        warnaTextbox: "input is-success",
        icon: <FontAwesomeIcon icon="check" color="green" />,
      };
    } else if (action.type === "TIDAK BISA") {
      return {
        hasil: (
          <p className="help is-danger" style={{ fontSize: "15px" }}>
            {nama + " tidak tersedia"}
          </p>
        ),
        warnaTextbox: "input is-danger",
        icon: <FontAwesomeIcon icon="times" color="red" />,
      };
    } else if (action.type === "TIDAK BOLEH") {
      return {
        hasil: (
          <p className="help is-danger" style={{ fontSize: "15px" }}>
            {nama + " tidak memenuhi ketentuan"}
          </p>
        ),
        warnaTextbox: "input is-danger",
        icon: <FontAwesomeIcon icon="times" color="red" />,
      };
    } else if (action.type === "error") {
      return {
        hasil: (
          <p className="help is-danger" style={{ fontSize: "15px" }}>
            Terjadi masalah saat mengakses database
          </p>
        ),
        warnaTextbox: "input is-danger",
        icon: <FontAwesomeIcon icon="times" color="red" />,
      };
    } else if (action.type === "default") {
      return userinitValue;
    }
  }

  const initialState = {
    warnaTextbox: "input",
    hasil: undefined,
    icon: undefined,
  };
  const [state, dispatch] = useReducer(reducer, initialState);

  const onChangeValueWithFunc = async (e) => {
    console.log(e.target.value);
    onChange({ ...field, [nama]: e.target.value });
    dispatch({ type: "LOADING" });

    try {
      const hasil = await fungsiCheck(e.target.value);
      if (hasil === "BISA") {
        dispatch({ type: "BISA" });
        onChange({
          ...field,
          [nama]: e.target.value,
          [nama + " Checked"]: true,
        });
      } else if (hasil === "TIDAK BISA") {
        dispatch({ type: "TIDAK BISA" });
        onChange({
          ...field,
          [nama]: e.target.value,
          [nama + " Checked"]: false,
        });
      } else if (hasil === "TIDAK BOLEH") {
        dispatch({ type: "TIDAK BOLEH" });
        onChange({
          ...field,
          [nama]: e.target.value,
          [nama + " Checked"]: false,
        });
      }
    } catch (er) {
      dispatch({ type: "error" });
      onChange({
        ...field,
        [nama]: e.target.value,
        [nama + " Checked"]: false,
      });
    }
  };

  const onChangeValue = (e) => {
    onChange({ ...field, [nama]: e.target.value });
  };
  return (
    <div className="field">
      <label className="label">{nama}</label>
      <div className="control has-icons-left has-icons-right">
        <input
          className={state.warnaTextbox}
          type={type}
          placeholder={placeholder}
          value={value}
          onInput={
            fungsiCheck !== undefined ? onChangeValueWithFunc : onChangeValue
          }
          maxLength={maxLength}
          id={id}
          required
        />
        <span className="icon is-small is-left">
          {IconLeft !== undefined && <i className={IconLeft}></i>}
        </span>
        <span className="icon is-small is-right">{state.icon}</span>
      </div>
      {state.hasil}
    </div>
  );
}
