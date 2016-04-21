from django.conf import settings
NOTE_TAGS = getattr(settings, "ATTACHMENT_NOTE_TAGS",
        {
            'issue':'Issue',
            'closed':'Closed'
        }
    )
