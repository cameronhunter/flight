define(

  [
    './shims/jquery.shim',
    './shims/vanilla.shim'
  ],

  function(jQueryShim, vanillaShim) {
    return vanillaShim;
  }
);
