import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
export function Namereducer(state, action) {
  if (action.type === "loading") {
    return {
      hasil: (
        <p className="help is-info" style={{ fontSize: "15px" }}>
          loading
        </p>
      ),
      warnaTextbox: "input is-info",
      icon: <FontAwesomeIcon icon="spinner" spin color="blue" />,
    };
  } else if (action.type === "available") {
    return {
      hasil: (
        <p className="help is-success" style={{ fontSize: "15px" }}>
          nama rak tersedia
        </p>
      ),
      warnaTextbox: "input is-success",
      icon: <FontAwesomeIcon icon="check" color="green" />,
    };
  } else if (action.type === "not available") {
    return {
      hasil: (
        <p className="help is-danger" style={{ fontSize: "15px" }}>
          nama rak item sudah terpakai
        </p>
      ),
      warnaTextbox: "input is-danger",
      icon: <FontAwesomeIcon icon="times" color="red" />,
    };
  } else if (action.type === "not allowed") {
    return {
      hasil: (
        <p className="help is-danger" style={{ fontSize: "15px" }}>
          nama rak tidak memenuhi ketentuan
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
    return rakinitValue;
  }
}

export const rakinitValue = {
  hasil: (
    <p className="help" style={{ fontSize: "15px" }}>
      Silahkan masukan nama rak!
    </p>
  ),
  warnaTextbox: "input",
  icon: null,
};

export function NamaRak({ className, value, onChange, icon, hasil }) {
  return (
    <div className="field">
      <label className="label">Nama Rak</label>
      <div className="control has-icons-left has-icons-right">
        <input className={className} type="text" placeholder="Nama Rak" value={value} onChange={onChange} />
        <span className="icon is-small is-left">
          <i className="fas fa-layer-group" />
        </span>
        <span className="icon is-small is-right">{icon}</span>
      </div>
      {hasil}
    </div>
  );
}

export function FieldButton({ nama, disabled }) {
  return (
    <div className="field">
      <div className="control">
        <button className="button is-link" disabled={disabled}>
          {nama}
        </button>
      </div>
    </div>
  );
}

export function Modal({ children, className = "" }) {
  return (
    <div className={`modal ${className}`}>
      <div className="modal-background" />
      <div className="modal-content">{children}</div>
    </div>
  );
}

export function IsiModalSuccess({ pesan, children }) {
  return (
    <article className="message">
      <div className="message-body" style={{ fontSize: "25px", textAlign: "center", color: "green" }}>
        {pesan}
      </div>
      <div style={{ textAlign: "center", padding: "10px" }}>{children}</div>
    </article>
  );
}

export function IsiModalFailed({ pesan, children }) {
  return (
    <article className="message">
      <div className="message-body" style={{ fontSize: "25px", textAlign: "center", color: "red" }}>
        {pesan}
      </div>
      <div style={{ textAlign: "center", padding: "10px" }}>{children}</div>
    </article>
  );
}
