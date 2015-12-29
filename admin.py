from models import File
from django.contrib.contenttypes.admin import GenericStackedInline


class FileInlineAdmin(GenericStackedInline):
    model = File
# class ProjectAdmin(GuardedModelAdmin):
#     model = Project
#     inlines = [
#         FileInlineAdmin,
#     ]
