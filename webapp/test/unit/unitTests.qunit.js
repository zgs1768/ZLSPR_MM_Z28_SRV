/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"gus/zodata_mm_0001_srv/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
