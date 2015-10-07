// CODE FOR MARY MUELLER DEPARTMENT/BU UPDATE

var array = ['40034','40192','40107','40111','40027','40032','40126','40046','40159','40167','40184','40147','40171','40188','40151','40163','40180','40086','40119','40139','40135','40060','40103','40081','40007','40035','40028','40011','40043','40116','40047','40127','40108','40131','40082','40120','40140','40164','40181','40144','40185','40172','40062','40152','40176','40177','40036','40031','40105','40157','40165','40182','40109','40145','40169','40102','40080','40137','40063','40123','40149','40173','40190','40121','40141','40153','40161','40083','40132','40099','40128','40038','40005','40033','40041','40049','40045','40106','40110','40191','40162','40179','40142','40158','40183','40146','40170','40039','40084','40138','40048','40056','40101','40129','40085','40093','40122'];

for (var x = 0; x < array.length; x++) {

	var dept = new GlideRecord('cmn_department');
	dept.addQuery('id',array[x]);
	dept.query();

	if (dept.next()) {

		dept.parent = '16ffb02721360dc8a7cd83e0b7e5f226';
		dept.update();

	}

}

// CODE TO INSERT FILE INTEGRITY CHECK (FIC) EXCLUSIONS

var array = ['Fenwebmms10','Fenwebmms11','Fenwebmms12','Fenwebmms13','Fenwebmmp30','Fenwebmmp31','Fenwebmmp32','Fenwebmmp33','Fenwebmmp34','Fenwapmms02','Fenwapmms03','Fenwapmmp09','Fenwapmmp10','Fenwapmmp11'];

for (var x = 0; x < array.length; x++) {

	var array2 = ['D:\\MMSLHQCC_Inetpub\\wwwroot\\Images\\','D:\\MMSLHQCC_Inetpub\\wwwroot\\Maintenance\\images\\','D:\\OffersSuntrust_Inetpub\\wwwroot\\images\\','D:\\PromotionsCtrSuntrust_Inetpub\\wwwroot\images\\','D:\\Regions_Inetpub\\wwwroot\\images\\','D:\\Regions_Inetpub\\wwwroot\\Maintenance\\images\\','D:\\Regions_Inetpub\\wwwroot\\TestPages\\','D:\\SitecoreAdmin_Inetpub\\wwwroot\\website\\App_Data\\MediaCache\\','D:\\SitecoreAdmin_Inetpub\\wwwroot\\website\\indexes\\__system\\','D:\\SuntrustOffersPlatformInetpub\\wwwroot\\images\\','D:\\SunTrustTeammatePortal_Inetpub\\wwwroot\\images\\','D:\\SitecoreAdmin_Inetpub\\wwwroot\\website\\indexes\\','D:\\PromotionsCtrSuntrust_Inetpub\\wwwroot\\images\\','D:\\OffersSuntrust_Inetpub\\wwwroot\\images\\','D:\\SunTrustTeammatePortal_Inetpub\\wwwroot\\images\\'];

	for (var y = 0; y < array2.length; y++) {
		var fic = new GlideRecord('u_file_integrity_exclusions');
		fic.initialize();
		fic.u_host = array[x].toLowerCase();
		fic.u_path = array2[y];
		fic.u_type = 'Recursive';
		fic.u_contact = '9c29c77800f9e400ba87f47595a1d157';
		fic.u_reason = 'Exclusions provided by Doug Schnurbusch and Aaron Brock via email on 10/5/15.';
		fic.insert();
	}

}
