/*global QUnit*/

sap.ui.define([
	"gus/zodata_mm_0001_srv/controller/InvoiceList.controller"
], function (Controller) {
	"use strict";

	QUnit.module("InvoiceList Controller");

	QUnit.test("I should test the InvoiceList controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
