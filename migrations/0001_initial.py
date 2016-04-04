# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('contenttypes', '0002_remove_content_type_name'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='File',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('file', models.FileField(upload_to=b'files')),
                ('name', models.CharField(max_length=100)),
                ('description', models.TextField(null=True, blank=True)),
                ('uploaded', models.DateTimeField(auto_now_add=True)),
                ('object_id', models.CharField(max_length=30)),
                ('admin_only', models.BooleanField(default=True)),
                ('content_type', models.ForeignKey(to='contenttypes.ContentType')),
                ('uploaded_by', models.ForeignKey(blank=True, to=settings.AUTH_USER_MODEL, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Note',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('content', models.TextField()),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('modified', models.DateTimeField(auto_now=True)),
                ('object_id', models.CharField(max_length=30)),
                ('admin_only', models.BooleanField(default=True)),
                ('content_type', models.ForeignKey(to='contenttypes.ContentType')),
                ('created_by', models.ForeignKey(related_name='notes', blank=True, to=settings.AUTH_USER_MODEL, null=True)),
                ('modified_by', models.ForeignKey(related_name='+', blank=True, to=settings.AUTH_USER_MODEL, null=True)),
                ('parent', models.ForeignKey(blank=True, to='attachments.Note', null=True)),
            ],
        ),
    ]
