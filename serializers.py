from rest_framework import serializers
from models import File, Note
from django.core.urlresolvers import reverse
        
class FileSerializer(serializers.ModelSerializer):
    file = serializers.SerializerMethodField(read_only=True)
    uploaded_by = serializers.StringRelatedField(many=False)
    class Meta:
        model = File
    def get_file(self,obj):
        if obj.id:
            return reverse('get_file',kwargs={'pk':obj.id})
        
    
class NoteSerializer(serializers.ModelSerializer):
    created_by = serializers.StringRelatedField(many=False)
    modified_by = serializers.StringRelatedField(many=False)
    class Meta:
        model = Note
