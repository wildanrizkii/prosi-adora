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
          nama supplier tersedia
        </p>
      ),
      warnaTextbox: "input is-success",
      icon: <FontAwesomeIcon icon="check" color="green" />,
    };
  } else if (action.type === "not available") {
    return {
      hasil: (
        <p className="help is-danger" style={{ fontSize: "15px" }}>
          nama supplier sudah terpakai
        </p>
      ),
      warnaTextbox: "input is-danger",
      icon: <FontAwesomeIcon icon="times" color="red" />,
    };
  } else if (action.type === "not allowed") {
    return {
      hasil: (
        <p className="help is-danger" style={{ fontSize: "15px" }}>
          nama supplier tidak memenuhi ketentuan
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
    return supplierinitValue;
  }
}

export const supplierinitValue = {
  hasil: (
    <p className="help" style={{ fontSize: "15px" }}>
      Silahkan masukan nama supplier!
    </p>
  ),
  warnaTextbox: "input",
  icon: null,
};

export const kodeinitValue = {
  warnaTextbox: "input",
  hasil: (
    <p className="help" style={{ fontSize: "15px" }}>
      Silahkan masukan kode!
    </p>
  ),
  warnaTextbox: "input",
  icon: null,
};

export const alamatinitValue = {
  warnaTextbox: "input",
  hasil: (
    <p className="help" style={{ fontSize: "15px" }}>
      Silahkan masukan alamat!
    </p>
  ),
  warnaTextbox: "input",
  icon: null,
};

export const nomorinitValue = {
  warnaTextbox: "input",
  hasil: (
    <p className="help" style={{ fontSize: "15px" }}>
      Silahkan masukan nomor hp!
    </p>
  ),
  warnaTextbox: "input",
  icon: null,
};

export const kotainitValue = {
  warnaTextbox: "input",
  hasil: (
    <p className="help" style={{ fontSize: "15px" }}>
      Silahkan pilih Kota!
    </p>
  ),
  warnaTextbox: "input",
  icon: null,
};

export const Kodereducer = (state, action) => {
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
          kode tersedia
        </p>
      ),
      warnaTextbox: "input is-success",
      icon: <FontAwesomeIcon icon="check" color="green" />,
    };
  } else if (action.type === "not available") {
    return {
      hasil: (
        <p className="help is-danger" style={{ fontSize: "15px" }}>
          kode sudah terpakai
        </p>
      ),
      warnaTextbox: "input is-danger",
      icon: <FontAwesomeIcon icon="times" color="red" />,
    };
  } else if (action.type === "not allowed") {
    return {
      hasil: (
        <p className="help is-danger" style={{ fontSize: "15px" }}>
          nama kode tidak memenuhi ketentuan
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
    return kotainitValue;
  }
};

export const Alamatreducer = (state, action) => {
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
          alamat tersedia
        </p>
      ),
      warnaTextbox: "input is-success",
      icon: <FontAwesomeIcon icon="check" color="green" />,
    };
  } else if (action.type === "not available") {
    return {
      hasil: (
        <p className="help is-danger" style={{ fontSize: "15px" }}>
          alamat sudah terpakai
        </p>
      ),
      warnaTextbox: "input is-danger",
      icon: <FontAwesomeIcon icon="times" color="red" />,
    };
  } else if (action.type === "not allowed") {
    return {
      hasil: (
        <p className="help is-danger" style={{ fontSize: "15px" }}>
          nama kode tidak memenuhi ketentuan
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
    return alamatinitValue;
  }
};

export const Nomorreducer = (state, action) => {
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
          nomor tersedia
        </p>
      ),
      warnaTextbox: "input is-success",
      icon: <FontAwesomeIcon icon="check" color="green" />,
    };
  } else if (action.type === "not available") {
    return {
      hasil: (
        <p className="help is-danger" style={{ fontSize: "15px" }}>
          nomor sudah terpakai
        </p>
      ),
      warnaTextbox: "input is-danger",
      icon: <FontAwesomeIcon icon="times" color="red" />,
    };
  } else if (action.type === "not allowed") {
    return {
      hasil: (
        <p className="help is-danger" style={{ fontSize: "15px" }}>
          nomor hp tidak memenuhi ketentuan
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
    return nomorinitValue;
  }
};

export const Kotareducer = (state, action) => {
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
          Kota tersedia
        </p>
      ),
      warnaTextbox: "input is-success",
      icon: <FontAwesomeIcon icon="check" color="green" />,
    };
  } else if (action.type === "not available") {
    return {
      hasil: (
        <p className="help is-danger" style={{ fontSize: "15px" }}>
          nomor sudah terpakai
        </p>
      ),
      warnaTextbox: "input is-danger",
      icon: <FontAwesomeIcon icon="times" color="red" />,
    };
  } else if (action.type === "not allowed") {
    return {
      hasil: (
        <p className="help is-danger" style={{ fontSize: "15px" }}>
          nomor hp tidak memenuhi ketentuan
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
    return nomorinitValue;
  }
};

export function NamaSupplier({ className, value, onChange, icon, hasil }) {
  return (
    <div className="field">
      <label className="label">Nama Supplier</label>
      <div className="control has-icons-left has-icons-right">
        <input
          className={className}
          type="text"
          placeholder="Nama Supplier"
          value={value}
          onChange={onChange}
        />
        <span className="icon is-small is-left">
          <i className="fas fa-vials" />
        </span>
        <span className="icon is-small is-right">{icon}</span>
      </div>
      {hasil}
    </div>
  );
}

export function KodeSupplier({ className, value, onChange, icon, hasil }) {
  return (
    <div className="field">
      <label className="label">Kode</label>
      <div className="control has-icons-left has-icons-right">
        <input
          className={className}
          type="text"
          placeholder="Kode Supplier"
          value={value}
          onChange={onChange}
        />
        <span className="icon is-small is-left">
          <i className="fas fa-quote-right" />
        </span>
        <span className="icon is-small is-right">{icon}</span>
      </div>
      {hasil}
    </div>
  );
}

export function Alamat({ className, value, onChange, icon, hasil }) {
  return (
    <div className="field">
      <label className="label">Alamat</label>
      <div className="control has-icons-left has-icons-right">
        <input
          className={className}
          type="text"
          placeholder="Alamat"
          value={value}
          onChange={onChange}
        />
        <span className="icon is-small is-left">
          <i className="fas fa-address-card" />
        </span>
        <span className="icon is-small is-right">{icon}</span>
      </div>
      {hasil}
    </div>
  );
}

export function NoHP({ className, value, onChange, icon, hasil }) {
  return (
    <div className="field">
      <label className="label">Nomor HP</label>
      <div className="control has-icons-left has-icons-right">
        <input
          className={className}
          type="text"
          placeholder="Nomor HP"
          value={value}
          onChange={onChange}
        />
        <span className="icon is-small is-left">
          <i className="fas fa-phone fa-flip-horizontal" />
        </span>
        <span className="icon is-small is-right">{icon}</span>
      </div>
      {hasil}
    </div>
  );
}

export function Kota({ className, value, onChange, hasil, arrKota }) {
  const opsi = arrKota.map((element, idx) => {
    return <option value={element.id_kota}>{element.nama_kota}</option>;
  });

  return (
    <div className="field">
      <label className="label">Kota</label>
      <div className="control">
        <div className="select">
          <select
            className={className}
            type="text"
            value={value}
            onChange={onChange}
          >
            {opsi}
          </select>
        </div>
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

// export function Role({ onChange, value }) {
//   return (
//     <div className="field">
//       <label className="label">Role</label>
//       <div className="control">
//         <div className="select">
//           <select onChange={onChange} value={value}>
//             <option value="pemilik">PEMILIK</option>
//             <option value="kasir">KASIR</option>
//             <option value="ttk">TTK</option>
//           </select>
//         </div>
//       </div>
//     </div>
//   );
// }

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
