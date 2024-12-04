// MainComponent.tsx
import MySwal from "./SweetAlertMaster";

MySwal.fire({
  title: <p>Hello World</p>,
  didOpen: () => {
    MySwal.showLoading();
  },
}).then(() => {
  return MySwal.fire(<p>Shorthand works too</p>);
});
