from django.conf import settings
from django.utils.module_loading import import_string
NOTE_TAGS = getattr(settings, "ATTACHMENT_NOTE_TAGS",
        {
            'issue':'Issue',
            'closed':'Closed'
        }
    )
ATTACHMENT_UPLOAD_TO_FUNCTION = getattr(settings, "ATTACHMENT_UPLOAD_TO_FUNCTION",None)
if ATTACHMENT_UPLOAD_TO_FUNCTION:
    UPLOAD_TO = import_string(ATTACHMENT_UPLOAD_TO_FUNCTION)
else:
    UPLOAD_TO = 'files'

FILE_SYSTEM_STORAGE = getattr(settings, "ATTACHMENT_FILE_SYSTEM_STORAGE",None)
if FILE_SYSTEM_STORAGE:
    FILE_SYSTEM_STORAGE = import_string(FILE_SYSTEM_STORAGE)