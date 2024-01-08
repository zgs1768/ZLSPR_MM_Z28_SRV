sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/model/odata/v2/ODataModel',
    "sap/m/MessageBox",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, ODataModel, MessageBox,) {
        "use strict";

        return Controller.extend("gus.zodatamm0001srv.controller.InvoiceList", {
            onInit: function () {
                //设置初始工厂,登录时获取
                this.byId("mandatoryFilterWerks").setProperty("low", 'H001')

            },

            formatDate(DateString) {
                if (DateString) {
                    let dateS = new Date(DateString)
                    return dateS.getFullYear() + "/" + (dateS.getMonth() + 1) + "/" + dateS.getDate()
                }
            },

            onBeforeRebindTable(oEvent) {

                var oView = this.getView()
                ODataModel = oView.getModel()
                var oSmartTable = oView.byId("STinvoiceList");
            },

            _navToDetail(datailInfo,LGORT,GIDAT) {
                const oRouter = this.getOwnerComponent().getRouter()
                oRouter.navTo('detail', {
                    datailInfo: window.encodeURIComponent(datailInfo),
                    LGORT: window.encodeURIComponent(LGORT),
                    GIDAT: window.encodeURIComponent(GIDAT)
                })
            },

            onPress(oEvent) {
                let that = this
                const oItem = oEvent.getSource()
                let bindText = oItem.getBindingContext()
                let datailInfo = bindText.getPath().substr(1)
                let LGORT =  bindText.getProperty("Lgort")
                let GIDAT = bindText.getProperty("Gidat")

                if (bindText.getProperty('Zstat') != 'A' && bindText.getProperty('Zstat') != 'X') {
                    MessageBox.error("差異転記済のため、棚卸伝票の修正はできません。")
                    return
                }else if (bindText.getProperty('Gidat') - bindText.getProperty('Zldat') == 0) {
                    MessageBox.warning("実地棚卸予定日と異なりますが棚卸を実施しますか。", {
                        actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                        emphasizedAction: MessageBox.Action.OK,
                        onClose: function (sAction) {
                            if (sAction == 'OK') {
                                that._navToDetail(datailInfo,LGORT,GIDAT)
                            }
                        }
                    })
                } else {
                    this._navToDetail(datailInfo,LGORT,GIDAT)
                }
            }
        });
    });
