from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        try:
            # Token 생성
            token = Token.objects.create(user=instance)
            logger.info(f"Token created for user {instance.username} with token key {token.key}")
        except Exception as e:
            logger.error(f"Error creating token for user {instance.username}: {e}")
