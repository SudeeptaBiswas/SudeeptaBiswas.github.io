// Site settings. Change a value, save, reload the page. No build step.
// A page can override these by setting window.SITE_CONFIG before code.js loads.
window.SITE_CONFIG = window.SITE_CONFIG || {
  // Run button on code blocks marked data-run="python". One plugin per file in assets/js/runners/.
  //   "pyodide"     Python runs in the reader's browser; output shows under the block.
  //                 First Run downloads ~9 MB once (cached by the browser for a year). numpy works.
  //   "pythontutor" Opens Python Tutor in a new tab: step-by-step view. Has ads; standard library only.
  //   "off"         No Run button. Copy and Download stay.
  runner: "pyodide",

  pyodide: { version: "314.0.7" },
  pythontutor: { py: "311" }   // Python version on pythontutor.com ("3" means 3.6: too old)
};
