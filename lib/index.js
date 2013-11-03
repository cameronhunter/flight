// ==========================================
// Copyright 2013 Twitter, Inc
// Licensed under The MIT License
// http://opensource.org/licenses/MIT
// ==========================================

define(

  [
    './advice',
    './component',
    './compose',
    './logger',
    './registry',
    './shim',
    './utils'
  ],

  function(advice, component, compose, logger, registry, shim, utils) {
    'use strict';

    return {
      advice: advice,
      component: component,
      compose: compose,
      logger: logger,
      registry: registry,
      shim: shim,
      utils: utils
    };

  }
);
