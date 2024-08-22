import OAuth2Client from "../../../../../../../common/services/liferay/oauth2/OAuth2Client";

export default class PartnerSpringBootOAuth2 extends OAuth2Client {

    constructor() {
		super(
			'liferay-partner-etc-spring-boot-oauth-application-user-agent'
		);
	}   

    async handleFileUpload(liferayFile: any): Promise<{ text: string; isValid: boolean }> {
        const formData = new FormData();
        formData.append('file', liferayFile);
        try {
            const response = await this.oAuth2Client.fetch('/file-validation/validate', {
                method: 'POST',
                body: formData,
            });
    
            const responseText = await response.text();
    
            if (response.ok) {
                return { text: responseText, isValid: true };
            } else {
                return { text: responseText, isValid: false };
            }
        } catch (error) {
            console.error('Error validating the file:', error);
    
            return { text: 'Error validating the file. Please try again.', isValid: false };
        }
    }
    

}