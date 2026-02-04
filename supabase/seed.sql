BEGIN;

-- Step 1: Define the slugs for all email templates in the main table.
-- We use slugs as a stable identifier instead of UUIDs in the code.
INSERT INTO public.email_templates (slug, description)
VALUES
    ('welcome', 'Sent to new users upon registration.'),
    ('payment-succeeded', 'Sent after a successful subscription payment.'),
    ('payment-failed', 'Sent when a subscription payment fails.'),
    ('trial-will-end', 'Sent a few days before a free trial ends.'),
    ('subscription-canceled', 'Sent when a user cancels their subscription.'),
    ('magic-link', 'Sent for passwordless sign-in.')
ON CONFLICT (slug) DO NOTHING;

-- Step 2: Add the English and Russian translations for each template.
-- This uses a CTE (Common Table Expression) to make it easy to associate translations with slugs.
WITH templates AS (
    SELECT id, slug FROM public.email_templates
)
INSERT INTO public.email_template_translations (template_id, language_code, subject, body)
VALUES
    -- Welcome Email
    ((SELECT id FROM templates WHERE slug = 'welcome'), 'en', 'Welcome to BioMath Core, {{userName}}!', '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;"><h1>Welcome!</h1><p>Hi {{userName}}, thank you for joining. Explore your dashboard <a href="https://biomathcore.com/member">here</a>.</p></div>'),
    ((SELECT id FROM templates WHERE slug = 'welcome'), 'ru', 'Добро пожаловать в BioMath Core, {{userName}}!', '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;"><h1>Добро пожаловать!</h1><p>Здравствуйте, {{userName}}, спасибо за регистрацию. Перейдите в ваш личный кабинет <a href="https://biomathcore.com/member">по ссылке</a>.</p></div>'),

    -- Payment Succeeded
    ((SELECT id FROM templates WHERE slug = 'payment-succeeded'), 'en', 'Payment Successful for {{planName}}', '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;"><h1>Payment Received</h1><p>Hi {{userName}}, your payment of ${{amount}} for the {{planName}} plan was successful.</p></div>'),
    ((SELECT id FROM templates WHERE slug = 'payment-succeeded'), 'ru', 'Платёж за {{planName}} прошёл успешно', '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;"><h1>Платёж получен</h1><p>Здравствуйте, {{userName}}, ваш платёж на сумму ${{amount}} за тариф {{planName}} прошёл успешно.</p></div>'),

    -- Payment Failed
    ((SELECT id FROM templates WHERE slug = 'payment-failed'), 'en', 'Payment Failed - Action Required', '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;"><h1>Payment Failed</h1><p>Hi {{userName}}, we were unable to process your payment (attempt {{attemptCount}}). Please <a href="https://biomathcore.com/member/billing">update your payment method</a>.</p></div>'),
    ((SELECT id FROM templates WHERE slug = 'payment-failed'), 'ru', 'Ошибка платежа - требуется действие', '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;"><h1>Ошибка платежа</h1><p>Здравствуйте, {{userName}}, нам не удалось обработать ваш платёж (попытка {{attemptCount}}). Пожалуйста, <a href="https://biomathcore.com/member/billing">обновите способ оплаты</a>.</p></div>'),

    -- Trial Will End
    ((SELECT id FROM templates WHERE slug = 'trial-will-end'), 'en', 'Your Trial Ends in {{daysRemaining}} Days', '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;"><h1>Trial Ending Soon</h1><p>Hi {{userName}}, your trial will end in {{daysRemaining}} days. <a href="https://biomathcore.com/pricing">Choose a plan</a> to continue.</p></div>'),
    ((SELECT id FROM templates WHERE slug = 'trial-will-end'), 'ru', 'Ваш пробный период заканчивается через {{daysRemaining}} дней', '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;"><h1>Пробный период скоро закончится</h1><p>Здравствуйте, {{userName}}, ваш пробный период истекает через {{daysRemaining}} дней. <a href="https://biomathcore.com/pricing">Выберите тариф</a>, чтобы продолжить.</p></div>'),

    -- Subscription Canceled
    ((SELECT id FROM templates WHERE slug = 'subscription-canceled'), 'en', 'Subscription Canceled', '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;"><h1>Subscription Canceled</h1><p>Hi {{userName}}, your subscription has been canceled and will remain active until {{endDate}}. You can reactivate it from your <a href="https://biomathcore.com/member/billing">billing page</a>.</p></div>'),
    ((SELECT id FROM templates WHERE slug = 'subscription-canceled'), 'ru', 'Подписка отменена', '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;"><h1>Подписка отменена</h1><p>Здравствуйте, {{userName}}, ваша подписка была отменена и будет активна до {{endDate}}. Вы можете снова активировать ее на <a href="https://biomathcore.com/member/billing">странице оплаты</a>.</p></div>'),

    -- Magic Link
    ((SELECT id FROM templates WHERE slug = 'magic-link'), 'en', 'Your Sign-In Link', '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;"><h1>Sign-In Link</h1><p>Hi {{userName}}, <a href="{{magicLink}}">click here to sign in</a>. This link expires in 15 minutes.</p></div>'),
    ((SELECT id FROM templates WHERE slug = 'magic-link'), 'ru', 'Ваша ссылка для входа', '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;"><h1>Ссылка для входа</h1><p>Здравствуйте, {{userName}}, <a href="{{magicLink}}">нажмите здесь для входа</a>. Ссылка истекает через 15 минут.</p></div>')
ON CONFLICT (template_id, language_code) DO NOTHING;

COMMIT;
