from rest_framework import viewsets
# from models import 
from serializers import *

class FileViewSet(viewsets.ModelViewSet):
    serializer_class = FileSerializer
#     permission_classes = [CustomPermission]
#     search_fields = ('name', 'description')
    model = File
    filter_fields = ('content_type', 'object_id')
    queryset = File.objects.all()
#     def get_queryset(self):
#         return File.objects.all()
    
class NoteViewSet(viewsets.ModelViewSet):
    serializer_class = NoteSerializer
#     permission_classes = [CustomPermission]
    filter_fields = ('content_type', 'object_id')
    model = Note
    queryset = Note.objects.all()
#     def get_queryset(self):
#         return Note.objects.all()#get_all_user_objects(self.request.user, ['view'], Experiment)
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
    def perform_update(self, serializer):
        serializer.save(modified_by=self.request.user)