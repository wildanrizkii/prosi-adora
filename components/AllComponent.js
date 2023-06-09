import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useReducer } from "react";

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
    onChange({ ...field, [nama]: e.target.value });
    dispatch({ type: "LOADING" });
    if (e.target.value === "") {
      dispatch({ type: "TIDAK BOLEH" });
    } else {
      try {
        const hasil = await fungsiCheck(e.target.value);
        if (hasil === "BISA") {
          dispatch({ type: "BISA" });
        } else {
          dispatch({ type: "TIDAK BISA" });
        }
      } catch (e) {
        dispatch({ type: "error" });
      }
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
}) {
  const onChangeValue = (e) => {
    onChange({ ...field, [nama]: e.target.value });
  };
  const isiOption = arr.map((element) => {
    return (
      <option
        key={element[mappingElement[0]]}
        value={element[mappingElement[0]]}
      >
        {element[mappingElement[1]]}
      </option>
    );
  });
  return (
    <div className="field">
      <label className="label">{nama}</label>
      <div className="control">
        <div className="select">
          <select onChange={onChangeValue} value={value}>
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
