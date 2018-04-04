import {HttpHeaders} from '@angular/common/http';

export class ServiceConstants {

  /* Until env variables are externalized && CAMEL... START */
  private static DEV_HOST = 'http://localhost:8081';
  private static DEV_EMAIL_HOST = 'http://localhost:8082';
  private static HOST = ServiceConstants.DEV_HOST;
  private static EMAIL_HOST = ServiceConstants.DEV_EMAIL_HOST;
  /* Until env variables are externalized && CAMEL... END */

  public static ACTION_CLASSIFICATION_OTHER_TYPE_URL = `${ServiceConstants.HOST}/yeti/ActionClassificationOtherTypes`;
  public static ACTION_CLASSIFICATION_TYPE_URL = `${ServiceConstants.HOST}/yeti/ActionClassificationTypes`;
  public static ACTION_CONTACT_URL = `${ServiceConstants.HOST}/yeti/ActionContacts`;
  public static ACTION_URL = `${ServiceConstants.HOST}/yeti/Actions`;
  public static CAMPAIGN_CLASSIFICATION_TYPE_URL = `${ServiceConstants.HOST}/yeti/CampaignClassificationTypes`;
  public static CAMPAIGN_OR_ACTION_URL = `${ServiceConstants.HOST}/yeti/CampaignOrActions`;
  public static CAMPAIGN_URL = `${ServiceConstants.HOST}/yeti/Campaigns`;
  public static COMPANY_ADDRESS_CLASSIFICATION_TYPE_URL = `${ServiceConstants.HOST}/yeti/CompanyAddressTypes`;
  public static COMPANY_CLASSIFICATION_TYPE_URL = `${ServiceConstants.HOST}/yeti/CompanyClassificationTypes`;
  public static COMPANY_OR_CONTACT_URL = `${ServiceConstants.HOST}/yeti/CompanyOrContacts`;
  public static COMPANY_URL = `${ServiceConstants.HOST}/yeti/Companies`;
  public static COMPANY_URL_TYPE_URL = `${ServiceConstants.HOST}/yeti/CompanyUrlTypes`;
  public static COMPANY_URL_URL = `${ServiceConstants.HOST}/yeti/CompanyUrls`;
  public static CONTACT_ADDRESS_CLASSIFICATION_TYPE_URL = `${ServiceConstants.HOST}/yeti/ContactAddressTypes`;
  public static CONTACT_CLASSIFICATION_TYPE_URL = `${ServiceConstants.HOST}/yeti/ContactClassificationTypes`;
  public static CONTACT_TITLE_TYPE_URL = `${ServiceConstants.HOST}/yeti/ContactTitleTypes`;
  public static CONTACT_URL = `${ServiceConstants.HOST}/yeti/Contacts`;
  public static CONTACT_URL_TYPE_URL = `${ServiceConstants.HOST}/yeti/ContactUrlTypes`;
  public static EMAIL_URL = `${ServiceConstants.HOST}/yeti/Emails`;
  public static SCOPE_TYPE_URL = `${ServiceConstants.HOST}/yeti/ScopeTypes`;

  public static EXT_EVENTS_URL = `${ServiceConstants.EMAIL_HOST}/yetiemail/ExtEvents`;
  public static EXT_EMAIL_URL = `${ServiceConstants.EMAIL_HOST}/yetiemail/ExtEmails`;
}
