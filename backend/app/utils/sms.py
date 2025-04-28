from __future__ import print_function
import clicksend_client
from clicksend_client import SmsMessage
from clicksend_client.rest import ApiException
from config import settings

configuration = clicksend_client.Configuration()
configuration.username = settings.CLICK_SEND_USERNAME
configuration.password = settings.CLICK_SEND_API

api_instance = clicksend_client.SMSApi(clicksend_client.ApiClient(configuration))



def send_sms(phone: str, message: str):
    sms_message = SmsMessage(source="php",
                        body=f"Your VizGen otp is : {message}",
                        to=phone,
                        schedule=1436874701)
    sms_messages = clicksend_client.SmsMessageCollection(messages=[sms_message])
    return api_instance.sms_send_post(sms_messages)