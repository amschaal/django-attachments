# {% load content_type %}
# {% with instance|content_type as ctype %}
#     <input type="hidden" name="content_type" value="{{ ctype.pk }}">
# {% endwith %}


from django import template
from attachments import NOTE_TAGS
import json
register = template.Library()
from django.contrib.contenttypes.models import ContentType
from attachments.models import File, Note

@register.filter
def content_type(obj):
    if not obj:
        return False
    return ContentType.objects.get_for_model(obj)
@register.filter
def content_type_id(obj):
    if not obj:
        return False
    return ContentType.objects.get_for_model(obj).id
@register.filter
def object_files(obj):
    if not obj:
        return False
    return File.objects.filter(object_id=obj.pk,content_type=ContentType.objects.get_for_model(obj))



class SettingsNode(template.Node):
    def render(self, context):
        context['note_tags'] = NOTE_TAGS
        context['note_tags_json'] = json.dumps(NOTE_TAGS) 
        return ''

@register.tag
def attachment_settings(parser, token):
    return SettingsNode()

# content_type = models.ForeignKey(ContentType)
#     object_id = models.CharField(max_length=30)