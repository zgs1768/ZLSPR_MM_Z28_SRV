sap.ui.define(
  [
    'sap/ui/core/mvc/Controller',
    'sap/ui/core/routing/History',
    'sap/m/MessageToast',
    "sap/m/MessageBox",
    'sap/ui/model/json/JSONModel',
    'sap/ui/model/odata/v2/ODataModel',
    'sap/ui/model/Filter',
    "sap/ui/model/FilterOperator",
  ],
  (Controller, History, MessageToast, MessageBox, JSONModel, ODataModel, Filter, FilterOperator) => {
    'use strict'

    var GjahrKey;
    var IblnrKey;
    var GIDAT;
    var LGORT;
    //初始化时检数情况
    var initItem = []
    //扫描后对下面数组进行操作
    var matItem = []



    return Controller.extend('gus.zodatamm0001srv.controller.Detail', {

      onInit() {
        const oRouter = this.getOwnerComponent().getRouter()
        oRouter
          .getRoute('detail')
          .attachPatternMatched(this.onObjectMatched, this)
      },

      onObjectMatched(oEvent) {
        var detailkey = window.decodeURIComponent(
          oEvent.getParameter('arguments').datailInfo)
        // IblnrKey = detailkey.substring(26, 36)
        // GjahrKey = detailkey.substring(45, 49)
         IblnrKey = '0' + detailkey.substring(26, 35)
         GjahrKey = detailkey.substring(44, 48)

        LGORT = window.decodeURIComponent(
          oEvent.getParameter('arguments').LGORT)
        GIDAT = window.decodeURIComponent(
          oEvent.getParameter('arguments').GIDAT)
        //设置标头
        let that = this
        this.getView().byId("headtext1").setText(IblnrKey)
        this.getView().byId("headtext2").setText(LGORT)
        this.getView().byId("headtext3").setText(that.formatDate(GIDAT))

        this.getView().bindElement({
          path:
            '/' +
            window.decodeURIComponent(
              oEvent.getParameter('arguments').datailInfo
            ),
          // model: 'PhDetail_Level',
        })
        //..................... 设置表数据.........................
        this.getView().setModel(new JSONModel([]), "detailModel");
        var oDetailModel = this.getView().getModel("detailModel");
        //默认oModel(odata)
        let oModelDefault = this.byId("DatailST").getModel()
        var oFilters = [];
        // oFilters.push(new Filter("Iblnr", FilterOperator.EQ, IblnrKey));
        oFilters.push(new Filter("Iblnr", FilterOperator.EQ, IblnrKey));
        oFilters.push(new Filter("Gjahr", FilterOperator.EQ, GjahrKey));
        oModelDefault.read("/PhDetail_LevelSet", {
          "method": "GET",
          filters: oFilters,
          success: function fnSuccess(oData, oResponse) {

            let responseData = oData.results
            responseData.forEach(element => {
              element.cMenge = 0
            })
            initItem = responseData
            oDetailModel.setProperty("/Detail", initItem);
            console.log(oModelDefault, oDetailModel)
          },
          error: function fnError(oError) {
            console.log("Error", oError);
          }
        })

      },

      onBeforeRebindTable(oEvent) {

        // var oView = this.getView()
        // var oModel = oView.getModel()
        // // var oFilters = [];
        //设置初始化过滤条件,
        // var mBindingParams = oEvent.getParameter("bindingParams");
        // var oFilters = mBindingParams.filters;
        // oFilters.push(new Filter("Iblnr", FilterOperator.EQ, `0` + IblnrKey));
        // oFilters.push(new Filter("Gjahr", FilterOperator.EQ, GjahrKey));
        ///////////////////////////////////////////////////////////////////////
        // oModel.read("/PhDetail_LevelSet", {
        //   "method": "GET",                     
        //   filters:oFilters,
        //   success: function fnSuccess(oData, oResponse) {
        //     alert('查询成功' )
        //     console.log("Response", oResponse)
        //     console.log("Data", oData)
        //   },
        //   error: function fnError(oError) {
        //     alert('查询错误')
        //     console.log("Error", oError);
        //   }
        // })
      },

      onInitialise(oEvent) {

      },


      onconfirmPress() {
        if (matItem.length == 0) {
          MessageToast.show("入力データ存在しません")
          return
        }
        var docData = "/Date(" + Date.now() + ")/"
        var planData = "/Date(" + Date.parse(GIDAT) + ")/"
        planData = docData
        var confirmInfo = {
          "PLANT": LGORT,
          "STGE_LOC": LGORT,
          "DOC_DATE": docData,
          "PLAN_DATE": planData,
          "To_Mat_Item": matItem
        }
        console.log("登录数据", confirmInfo)

        var baseUrl = this.getOwnerComponent().getModel().sServiceUrl
        var surl = baseUrl + "/Matphy_H_CreateSet"
        //var token = null;
        //var token = this.getOwnerComponent().getModel("XXXX").getSecurityToken();
        // $.ajax({
        //   url:  baseUrl,
        //   type: "GET",
        //   async: false,
        //   beforeSend: function (xhr) {
        //     xhr.setRequestHeader("X-CSRF-Token", "Fetch");
        //   },
        //   complete: function (xhr) {
        //     token = xhr.getResponseHeader("X-CSRF-Token");
        //   }
        // });
        //console.log("token===", token)
        // $.ajax({
        //   type: "POST",
        //   contentType: "application/json",
        //   url: surl,
        //   dataType: "json",
        //   crossDomain: true,
        //   headers: {
        //     'Accept': 'application/json',
        //     'X-CSRF-Token': token,  // get方法取得的Token  
        //   },
        //   data: JSON.stringify(confirmInfo),
        //   async: false,
        //   success: function (data, textStatus, jqXHR) {
        //     alert("success to post");
        //   },
        //   error: function (data, textStatus, jqXHR) {
        //   MessageToast.show(data.responseJSON.error.message.value);
        //   }
        // });


        var oModelc = this.getView().getModel()
        // oContext = oModelc.createEntry("/Matphy_H_CreateSet", confirmInfo);
        // oContext.created().then(function () {
        //   MessageToast.show(oContext.getProperty("PLANT"));
        // });

        oModelc.create("/Matphy_H_CreateSet", confirmInfo, {
          async: false,
          success: function (oData, oResponse) {
            console.log(oData.oResponse);
          },
          error: function (oError) {
            MessageBox.error(JSON.parse(oError.responseText).error.message.value)
          }
        })
      },


      onreturnPress() {
        const oHistory = History.getInstance()
        const sPreviousHash = oHistory.getPreviousHash()
        const oRouter = this.getOwnerComponent().getRouter()
        if (matItem.length == 0) {
          initItem = []
          if (sPreviousHash !== undefined) {
            window.history.go(-1)
          } else {
            oRouter.navTo("RouteInvoiceList", {}, true)
          }
        } else {
          MessageBox.warning("検数が入力されています。本当に戻りますか？", {
            actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
            emphasizedAction: MessageBox.Action.OK,
            onClose: function (sAction) {
              matItem = []
              initItem = []
              if (sAction == 'OK') {
                if (sPreviousHash !== undefined) {
                  window.history.go(-1)
                } else {
                  oRouter.navTo("RouteInvoiceList", {}, true)
                }
              }
            }
          })
        }
      },


      formatMenge(Menge) {
        return Menge.substring(0, Menge.indexOf('.'));
      },

      formatDate(DateString) {
        let dateS = new Date(DateString)
        return dateS.getFullYear() + "." + (dateS.getMonth() + 1) + "." + dateS.getDate()
      },



      //`````````````````````````````扫描相关操作````````````````````````````````````///

      onScanSuccess: function (oEvent) {
        if (oEvent.getParameter("cancelled")) {
          console.log("取消扫描")
          MessageToast.show("Scan cancelled", { duration: 1000 });
        } else {
          let barCode = oEvent.getParameter("text")
          //扫描数据样列 i001m58s1
          let item = barCode.substring(1, 4)
          let mCode = barCode.substring(5, 7)
          let sType = barCode.substring(8, 9)
          let existFlag = false
          initItem.forEach(e => {
            if (e.Zeili == item && e.Matnr == mCode) {
              existFlag = true
              if (parseFloat(e.Menge) + parseFloat(e.cMenge) >= parseFloat(e.Buchm)) {
                MessageBox.error("シリアルNo：" + e.Zeili + "は既に検数済です。")
                return
              }
              e.cMenge = parseFloat(e.cMenge) + 1
              var scanItem = {
                "Material": mCode,
                "STOCK_TYPE": sType
              }
              matItem.push(scanItem)
              console.log("添加后", matItem);
              console.log("添加后table", initItem)
              this.getView().getModel("detailModel").refresh()
            }
          })
          if (existFlag) {
            existFlag = false
          } else {
            MessageBox.error("QRコード明細:" + item + "品目:" + mCode + "は該当伝票に存在しません。");
          }
        }
      },

      onScanError: function (oEvent) {
        console.log("扫描失败")
        MessageToast.show("Scan failed: " + oEvent, { duration: 1000 });
      },

      onHandyPress() {
        var that = this
        var checkResult = []
        if (matItem.length == 0) {
          MessageToast.show("入力データ存在しません")
          return
        }
        let malen = matItem.length
        let mIndex = 0
        that.checkMatnr(checkResult, malen, mIndex)
      },

      checkMatnr(checkResult, malen, mIndex) {
        var that = this
        var oModelP = this.getView().getModel();
        oModelP.callFunction("/Matnr_Check", {
          "method": "GET",
          async: false,
          urlParameters: {
            Matnr: "0000000000000000" + matItem[mIndex].Material,
            format: "json"
          },
          success(oData, response) {
            if (response.data.Matnr_Check.Result === "Faild") {
              checkResult.push("Matnr_CheckFaild" + matItem[mIndex].Material)
            }
            mIndex += 1
            if (mIndex == malen) {
              that.doSomething(checkResult)
              return
            }
            that.checkMatnr(checkResult, malen, mIndex)
          },
          error(odata) {
            checkResult.push(odata.message + matItem[mIndex].Material)
            mIndex += 1
            if (mIndex == malen) {
              that.doSomething(checkResult)
              return
            }
            that.checkMatnr(checkResult, malen, mIndex)
          }
        })
      },
      doSomething(checkResult) {
        if (checkResult.length > 0) {
          let messageTotal
          checkResult.forEach(e => {
            messageTotal = messageTotal + '/n' + e
          });
          MessageBox.error("チェック失敗" + messageTotal)
        } else {
          MessageToast.show("入力したデータ問題ありません")
        }
      }
    })
  }
)
