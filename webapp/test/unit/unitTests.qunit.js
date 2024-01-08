/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"gus/zlspr_mm_z28_srv/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
