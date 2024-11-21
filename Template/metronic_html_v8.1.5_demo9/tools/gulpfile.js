import { cleanTask } from "./gulp/clean.js";
import {
    localHostTask,
    reloadTask,
    watchJSTask,
    watchSCSSTask,
    watchTask,
} from "./gulp/watch.js";
import { compileTask } from "./gulp/compile.js";

// Clean tasks:
export { cleanTask as clean };

// Watch tasks:
export { localHostTask as localhost };
export { reloadTask as reload };
export { watchTask as watch };
export { watchSCSSTask as watchSCSS };
export { watchJSTask as watchJS };

// Main tasks:
// export { rtlTask as rtl };
// export { buildBundleTask as buildBundle };
export { compileTask as compile };

// Entry point:
export default compileTask;
