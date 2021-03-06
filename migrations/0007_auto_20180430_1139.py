# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2018-04-30 18:39
from __future__ import unicode_literals

from django.db import migrations, models
import glims.attachments_config


class Migration(migrations.Migration):

    dependencies = [
        ('attachments', '0006_auto_20180430_1112'),
    ]

    operations = [
        migrations.AlterField(
            model_name='file',
            name='file',
            field=models.FileField(max_length=250, upload_to=glims.attachments_config.attachment_upload_to),
        ),
        migrations.AlterField(
            model_name='file',
            name='name',
            field=models.CharField(max_length=100),
        ),
    ]
