from rest_framework import serializers
from models import File, Note, URL
from django.core.urlresolvers import reverse
from django.template.defaultfilters import filesizeformat
        
class FileSerializer(serializers.ModelSerializer):
    file = serializers.SerializerMethodField(read_only=True)
    uploaded_by = serializers.StringRelatedField(many=False)
    size = serializers.SerializerMethodField(read_only=True)
    class Meta:
#         fields = ('id','created_by','modified_by','')
        model = File
    def get_file(self,obj):
        if obj.id:
            return reverse('get_file',kwargs={'pk':obj.id})
    def get_size(self,obj):
        if obj.file:
            return filesizeformat(obj.file.size)    
    
class NoteSerializer(serializers.ModelSerializer):
    created_by = serializers.StringRelatedField(many=False)
    modified_by = serializers.StringRelatedField(many=False)
    class Meta:
        model = Note

class URLSerializer(serializers.ModelSerializer):
    modified_by = serializers.StringRelatedField(many=False)
    class Meta:
        model = URL