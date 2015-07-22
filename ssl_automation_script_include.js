//SSL Renewal Request Automation ... Brandon Yocom 11/2014
var M_Auto_Create_SC_SSL_Renewal = Class.create();
M_Auto_Create_SC_SSL_Renewal.prototype = {
	
	initialize: function(sslSysID,contact,expiration) {
		this.sslSysID = sslSysID; //reference
		this.contact = contact; //reference
		this.expiration = expiration; //date/time
		gs.log('BSY --> Values passed in -- ssl = ' + this.sslSysID + ', contact = ' + this.contact + ', expiration = ' + this.expiration);
	},
	
	createSSLRenewalReq: function() {
		
		//find Sys ID of SSL Renewal Request Item
		var sslItemSysID = '';
		var sslItem = new GlideRecord('sc_cat_item');
		sslItem.addQuery("name", "SSL Renewal Request");
		sslItem.query();
		if (sslItem.next()) {
			sslItemSysID = sslItem.sys_id;
		}
		
		
		//nuke the current cart
		nukeCart();
		
		
		//new cart
		var realCart = getCart();
		var cartID = realCart.sys_id;
		
		
		// add SSL Renewal to Cart
		addToCart(cartID, sslItemSysID, 1);
		addOptions(cartID);
		doOrder();
		function addToCart(cartid, cat_item, quantity) {
			var gr = new GlideRecord('sc_cart_item');
			gr.initialize();
			gr.cart = cartid;
			gr.cat_item = cat_item;
			gr.quantity = quantity;
			gr.insert();
		}
		function addOptions(cartID) {
			// Get the Cart Item
			var kids = new GlideRecord('sc_cart_item');
			kids.addQuery('cart', cartID);
			kids.query();
			if (kids.next()) {
				
				// Look up the options for the item in the cart
				var options = new GlideRecord('item_option_new');
				options.addQuery('cat_item', kids.cat_item);
				options.query();
				// Add the appropriate Item Options
				//gs.log('OPTIONS COUNT --- ' + options.getRowCount());
				while (options.next()) {
					var gr = new GlideRecord('sc_item_option');
					gr.initialize();
					if (options.question_text == "Which SSL certificate is due for renewal?") {
						gr.item_option_new.setValue(options.sys_id);
						//gs.log('BSY --> SSL SYS ID = ' + this.sslSysID + ' contact = ' + this.contact);
						gr.value = this.sslSysID;
					}
					else if (options.question_text == "Who is the contact for the SSL certificate?") {
						gr.item_option_new.setValue(options.sys_id);
						gr.value = this.contact;
					}
					else if (options.question_text == "When is the SSL expiring?") {
						gr.item_option_new.setValue(options.sys_id);
						gr.value = this.expiration;
					}
					//add status_tracking variable - hidden
					else if (options.question_text == "SSL renewal status tracking:") {
						gr.item_option_new.setValue(options.sys_id);
						gr.value = 'Waiting';
					}
					gr.cart_item.setValue(kids.sys_id);
					gr.insertWithReferences();
				}
			}
		}
		function nukeCart() {
			var cart = getCart();
			var id = cart.sys_id;
			var kids = new GlideRecord('sc_cart_item');
			kids.addQuery('cart', cart.sys_id);
			kids.deleteMultiple();
		}
		function getCart() {
			var cart = new GlideRecord('sc_cart');
			var userid = gs.getUserID();  // original
			//var userid = gs.getSession().impersonate(empSysID);
			cart.addQuery('user', userid);
			cart.query();
			if (cart.next()) {
				// we already have a cart all is well
			}
			else {
				cart.initialize();
				cart.user = userid;
				cart.insert();
			}
			return cart;
		}
		function doOrder() {
			var req = new GlideappRequestNew();
			//req.requested_for = this.owner;
			var rc = req.copyCart();
			gs.log('BSY --> AUTOMATION: SSL RENEWAL REQUEST CREATED --> ' + rc.number);
			/*var reqNum = new GlideRecord('u_lawson_changes');
			reqNum.addQuery('sys_id',this.sysID);
			reqNum.query();
			if (reqNum.next()) {
				reqNum.u_request_number = rc.sys_id;
				reqNum.u_processed = true;
				reqNum.updateWithReferences();
			}*/
			
			gs.log('BSY --> RC.SYS_ID = ' + rc.sys_id);
			
			var rq = new GlideRecord('sc_request');
			rq.addQuery('sys_id',rc.sys_id);
			rq.query();
			
			if(rq.next()) {
				rq.requested_for = this.contact;
				rq.updateWithReferences();
			}
			
			
			
			var gr = new GlideRecord('sc_req_item');
			gr.addQuery('request',rc.sys_id);
			gr.query();
			
			if(gr.next()) {
				gr.impact = 4;
				gr.due_date = this.expiration;
				gr.configuration_item = this.sslSysID;
				gr.update();
			}
			//rc.cat_item = ncrItemSysID;
		}
		
	},
	
	type: 'M_Auto_Create_SC_SSL_Renewal'
};