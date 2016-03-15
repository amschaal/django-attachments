from django.shortcuts import render, redirect
from django.template.context import RequestContext
from models import *
from sendfile import sendfile
from forms import FileForm
from attachments.serializers import FileSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view

def get_file(request,pk):
    file = File.objects.get(id=pk)
    return sendfile(request, file.file.path)
def attach_file_old(request,content_type_id,pk):
    ct = ContentType.objects.get(id=content_type_id)
    klass = ct.model_class()
    obj = klass.objects.get(pk=pk)
    next = request.REQUEST.get('next',request.META['HTTP_REFERER'])
    if request.method == 'GET':
        form = FileForm()
    elif request.method == 'POST':
        form = FileForm(request.POST,request.FILES)
        if form.is_valid():
            obj = form.save(commit=False)
            obj.uploaded_by=request.user
            obj.object_id = pk
            obj.content_type = ct
            obj.save()
            return redirect(next)
    return render(request, 'attachments/attach_file.html', {'form':form, 'obj': obj, 'next':next} ,context_instance=RequestContext(request))

@api_view(['POST'])
def attach_file(request,content_type_id,pk):
    ct = ContentType.objects.get(id=content_type_id)
    klass = ct.model_class()
    obj = klass.objects.get(pk=pk)
    if request.method == 'GET':
        form = FileForm()
    elif request.method == 'POST':
        form = FileForm(request.POST,request.FILES)
        if form.is_valid():
            obj = form.save(commit=False)
            obj.uploaded_by=request.user
            obj.object_id = pk
            obj.content_type = ct
            obj.name = obj.file.name
            obj.save()
            return Response(FileSerializer(obj).data)
        else:
            return Response({'errors':form.errors},status=404)