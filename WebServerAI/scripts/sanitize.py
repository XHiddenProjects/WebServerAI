import re, logging
class SensitiveFilter(logging.Filter):
    def __init__(self, keys_to_redact):
        self.keys_to_redact = keys_to_redact
    def filter(self, record):
        if hasattr(record, 'msg'):
            log_data = record.msg
            for key in self.keys_to_redact:
                if key in log_data:
                    log_data[key] = 'REDACTED'
            record.msg = log_data
        return True
def mask_sensitive_data(log_data):
    # Tokenize sensitive information (e.g., passwords, credit card numbers)
    log_data['phoneNumber'] = 'REDACTED'
    return log_data


# Configure the logger to use the custom filter
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
filter = SensitiveFilter(['password', 'phone_number'])
logger.addFilter(filter)