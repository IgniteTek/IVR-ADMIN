/*eslint-env node*/
/* eslint-disable  no-console */
/*global  */

'use strict';

var express = require('express');
var router = express.Router();
var Encryption = require('../service/encryption');
var db = require('../service/dbExtension');

require('dotenv').load();

var uuid = require('node-uuid');

var inspect = require('eyes').inspector({
  stream: null,
  colors: false
});

var cacheEngine = require('../service/cacheEngine');


router.post('/createCampaign', function(req, res) {
  var params = [{
      param: 'v_companyId',
      value: req.body.companyId
    },
    {
      param: 'v_campaignName',
      value: req.body.campaign_name
    },
    {
      param: 'v_introPrompt',
      value: req.body.greeting
    },
    {
      param: 'v_warrantyPrice',
      value: req.body.warrantyPrice
    },
    {
      param: 'v_rushPrice',
      value: req.body.rushPrice
    }
  ];
  var cursors = [{
      cursor: 'cur_result'
    },
    {
      cursor: 'cur_result2'
    }
  ];

  db.execProc('SIVR.createCampaign',
    params,
    cursors,
    function(err, j) {
     // console.log('got back from execdb', j);
      console.log('got back from execdb SIVR.createCampaign');
      res.json(j);
      return;
    });

});

router.post('/updateCampaignItem', function(req, res) {
  var params = [{
      param: 'v_campaignId',
      value: req.body.campaignId
    },
    {
      param: 'v_catalogId',
      value: req.body.catalogId
    },
    {
      param: 'v_maxQty',
      value: req.body.quantity
    },
    {
      param: 'v_unitPrice',
      value: req.body.unitPrice
    },
    {
      param: 'v_unitShipping',
      value: req.body.unitShipping
    },
  ];
  var cursors = [{
      cursor: 'cur_result'
    },
    {
      cursor: 'cur_result2'
    }
  ];

  db.execProc('SIVR.campaignAddOrUpdateItem',
    params,
    cursors,
    function(err, j) {
      console.log('got back from execdb', j);
      res.json(j);
      return;
    });

});


router.post('/updateCampaign', function(req, res) {
  var params = [{
      param: 'v_companyId',
      value: req.body.companyId
    },
    {
      param: 'v_campaignId',
      value: req.body.ID
    },
    {
      param: 'v_campaignName',
      value: req.body.CAMPAIGNNAME
    },
    {
      param: 'v_introPrompt',
      value: req.body.INTROPROMPT
    },
    {
      param: 'v_warrantyPrice',
      value: req.body.WARRANTYPRICE
    },
    {
      param: 'v_rushPrice',
      value: req.body.RUSHPRICE
    }
  ];
  var cursors = [{
      cursor: 'cur_result'
    },
    {
      cursor: 'cur_result2'
    }
  ];

  db.execProc('SIVR.updateCampaign',
    params,
    cursors,
    function(err, j) {
      console.log('got back from execdb', j);
      res.json(j);
      return;
    });

});
router.get('/RemoveCampaignItem', function(req, res) {
  var params = [{
      param: 'v_campaignId',
      value: req.query.campaignId
    },
    {
      param: 'v_catalogId',
      value: req.query.catalogId
    }
  ];
  var cursors = [{
      cursor: 'cur_result'
    },
    {
      cursor: 'cur_result2'
    }
  ];

  db.execProc('SIVR.campaignRemoveItem',
    params,
    cursors,
    function(err, j) {
      console.log('got back from execdb', j);
      res.json(j);
      return;
    });

});
router.get('/getCampaignStats', function(req, res) {
  var params = [{
      param: 'v_campaignId',
      value: req.query.campaignId
    },
    {
      param: 'v_startDt',
      type: db.DATE,
      value: new Date(req.query.startDt)
    },
    {
      param: 'v_endDt',
      type: db.DATE,
      value: new Date(req.query.endDt)
    }
  ];
  var cursors = [{
    cursor: 'cur_result'
  }];
  debugger;
  db.execProc('SIVR.getCampaignStats',
    params,
    cursors,
    function(err, j) {
     // console.log('got back from execdb', j);
      console.log('got back from execdb');
      debugger;
      res.json(j);
      return;
    });

});
router.post('/addCatalogItem', function(req, res) {
  debugger;
  var params = [{
    param: 'v_companyId',
    value: req.body.companyId
  },
  {
    param: 'v_productName',
    value: req.body.product_name
  },
  {
    param: 'v_productCode',
    value: req.body.item_code
  },
  {
    param: 'v_sku',
    value: req.body.sku_code
  },
  {
    param: 'v_variants',
    value: req.body.attributes
  },
  {
    param: 'v_prompt',
    value: req.body.greeting
  },
  
];
var cursors = [{
    cursor: 'cur_result'
  },
  {
    cursor: 'cur_result2'
  }
];
db.execProc('SIVR.addCatalogItem',
    params,
    cursors,
    function(err, j) {
      console.log('got back from execdb', j);
      res.json(j);
      return;
    });
  
});
/*router.post('/addCatalogItem', function(req, res) {
  var params = [{
      param: 'v_companyId',
      value: req.body.companyId
    },
    {
      param: 'v_productName',
      value: req.body.product_name
    },
    {
      param: 'v_productCode',
      value: req.body.item_code
    },
    {
      param: 'v_sku',
      value: req.body.sku_code
    },
  ];
  var cursors = [{
      cursor: 'cur_result'
    },
    {
      cursor: 'cur_result2'
    }
  ];

  db.execProc('SIVR.addCatalogItem',
    params,
    cursors,
    function(err, j) {
      console.log('got back from execdb', j);
      res.json(j);
      return;
    });

});*/
router.post('/updateCatalogItem', function(req, res) {
  var params = [{
      param: 'v_catalogId',
      value: req.body.ID
    },
    {
      param: 'v_companyId',
      value: req.body.companyId
    },
    {
      param: 'v_productName',
      value: req.body.PRODUCTNAME
    },
    {
      param: 'v_productCode',
      value: req.body.PRODUCTCODE
    },
    {
      param: 'v_sku',
      value: req.body.SKU
    },
  ];
  var cursors = [{
      cursor: 'cur_result'
    },
    {
      cursor: 'cur_result2'
    }
  ];

  db.execProc('SIVR.updateCatalogItem',
    params,
    cursors,
    function(err, j) {
      console.log('got back from execdb', j);
      res.json(j);
      return;
    });

});
router.get('/getCatalog', function(req, res) {
  debugger;
  var params = [{
    param: 'v_companyId',
    value: req.query.companyId
  }];
  var cursors = [{
    cursor: 'cur_result'
  }];

  db.execProc('SIVR.getCompanyCatalog',
    params,
    cursors,
    function(err, j) {
      //console.log('got back from execdb', j);
      console.log('got back from execdb SIVR.getCompanyCatalog');
      res.json(j);
      return;
    });

});

router.get('/getCompanyPhoneNumbers', function(req, res) {
  debugger;
  var params = [{
    param: 'v_companyId',
    value: req.query.companyId
  }];
  var cursors = [{
      cursor: 'phone'
    }
  ];

  db.execProc('SIVR.getCompanyPhoneNumbers',
    params,
    cursors,
    function(err, j) {
      debugger;
      console.log('got back from execdb', j);
      //console.log('got back from execdb SIVR.getCompanyPhoneNumbers');
      res.json(j);
      return;
    });

});

router.get('/requestPhoneNumber', function(req, res) {
  debugger;
  var params = [{
    param: 'v_companyId',
    value: req.query.companyId
  }];
  var cursors = [{
      cursor: 'phone'
    }
  ];

  db.execProc('SIVR.requestPhoneNumber',
    params,
    cursors,
    function(err, j) {
      debugger;
      console.log('got back from execdb', j);
      //console.log('got back from execdb SIVR.getCompanyPhoneNumbers');
      res.json(j);
      return;
    });

});

router.get('/releasePhoneNumber', function(req, res) {
  debugger;
  var params = [{
    param: 'v_companyId',
    value: req.query.companyId
  },{
    param: 'v_DN',
    value: req.query.number
  } ];
  var cursors = [
      
  ];

  db.execProc('SIVR.releasePhoneNumber',
    params,
    cursors,
    function(err, j) {
      debugger;
      if(err){
        var result = {};
        result.success = false;
        res.json(result);
        return;
      }else{
        var result = {};
        result.success = true;
        res.json(result);
        return;
      }
    });

});

router.get('/assignPhoneNumber', function(req, res) {
  debugger;
  var params = [{
    param: 'v_companyId',
    value: req.query.companyId
  },{
    param: 'v_DN',
    value: req.query.number
  },{
    param: 'v_campaignId',
    value: req.query.campaignId
  }];
  var cursors = [
      
  ];

  db.execProc('SIVR.assignPhoneNumber',
    params,
    cursors,
    function(err, j) {
      debugger;
      //console.log('got back from execdb', j);
      //console.log('got back from execdb SIVR.getCompanyPhoneNumbers');
      if(err){
        var result = {};
        result.success = false;
        res.json(result);
        return;
      }else{
        var result = {};
        result.success = true;
        res.json(result);
        return;
      }
      
    });

});
router.get('/getCampaign', function(req, res) {
  var params = [{
    param: 'v_campaignId',
    value: req.query.campaignId
  }];
  var cursors = [{
      cursor: 'campaign'
    },
    {
      cursor: 'phone'
    },
    {
      cursor: 'catalog'
    },
  ];

  db.execProc('SIVR.getCampaignDetails',
    params,
    cursors,
    function(err, j) {
     // console.log('got back from execdb', j);
      console.log('got back from execdb SIVR.getCampaignDetails');
      res.json(j);
      return;
    });

});

router.get('/getCampaigns', function(req, res) {
  var params = [{
    param: 'v_companyId',
    value: req.query.companyId
  }];
  var cursors = [{
    cursor: 'cur_result'
  }];

  db.execProc('SIVR.getCompanyCampaigns',
    params,
    cursors,
    function(err, j) {
     // console.log('got back from execdb', j);
      console.log('got back from execdb SIVR.getCompanyCampaigns');
      res.json(j);
      return;
    });

});
module.exports = router;
