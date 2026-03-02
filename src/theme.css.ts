import { createVar, globalStyle } from '@vanilla-extract/css';

export const colorBgPage = createVar();
export const colorBgSurface = createVar();
export const colorBgSurfaceHover = createVar();

export const colorTextPrimary = createVar();
export const colorTextHeading = createVar();
export const colorTextSecondary = createVar();
export const colorTextMuted = createVar();
export const colorTextWhite = createVar();

export const colorBorder = createVar();
export const colorBorderLight = createVar();
export const colorBorderMedium = createVar();
export const colorBorderInput = createVar();

export const colorSuccess = createVar();
export const colorDanger = createVar();
export const colorDangerBg = createVar();
export const colorDangerBgHover = createVar();
export const colorDangerBorder = createVar();
export const colorNeutralLight = createVar();
export const colorNeutral = createVar();
export const colorBgZonePromotion = createVar();
export const colorBgZonePromotionAlt = createVar();
export const colorBgZonePlayoff = createVar();
export const colorBgZonePlayoffAlt = createVar();
export const colorBgZoneRelegation = createVar();
export const colorBgZoneRelegationAlt = createVar();
export const colorTextZonePromotion = createVar();
export const colorTextZonePlayoff = createVar();
export const colorTextZoneRelegation = createVar();
export const colorBgRowAlt = createVar();
export const colorBgTableHeader = createVar();

export const colorFocus = createVar();
export const colorFocusRing = createVar();

export const fontFamily = createVar();

export const fontSizeXs = createVar();
export const fontSizeSm = createVar();
export const fontSizeBase = createVar();
export const fontSizeMd = createVar();
export const fontSizeLg = createVar();
export const fontSizeXl = createVar();

export const space1 = createVar();
export const space2 = createVar();
export const space3 = createVar();
export const space4 = createVar();
export const space6 = createVar();
export const space8 = createVar();
export const space12 = createVar();

export const radiusSm = createVar();
export const radiusMd = createVar();
export const radiusLg = createVar();

export const shadowSm = createVar();
export const shadowMd = createVar();

export const maxWidthContent = createVar();

globalStyle(':root', {
  vars: {
    [colorBgPage]: '#f3f4f6',
    [colorBgSurface]: '#ffffff',
    [colorBgSurfaceHover]: '#f9fafb',

    [colorTextPrimary]: '#1f2937',
    [colorTextHeading]: '#111827',
    [colorTextSecondary]: '#6b7280',
    [colorTextMuted]: '#666666',
    [colorTextWhite]: '#ffffff',

    [colorBorder]: '#e5e7eb',
    [colorBorderLight]: '#f3f4f6',
    [colorBorderMedium]: '#9ca3af',
    [colorBorderInput]: '#e0e0e0',

    [colorSuccess]: '#16a34a',
    [colorDanger]: '#dc2626',
    [colorDangerBg]: '#fef2f2',
    [colorDangerBgHover]: '#fee2e2',
    [colorDangerBorder]: '#fecaca',
    [colorNeutralLight]: '#c0c5cc',
    [colorNeutral]: '#9ca3af',
    [colorBgZonePromotion]: '#defce5',
    [colorBgZonePromotionAlt]: '#cbf6d4',
    [colorBgZonePlayoff]: '#deecfe',
    [colorBgZonePlayoffAlt]: '#cce1fc',
    [colorBgZoneRelegation]: '#fee1e1',
    [colorBgZoneRelegationAlt]: '#fcd0d0',
    [colorTextZonePromotion]: '#166534',
    [colorTextZonePlayoff]: '#1e40af',
    [colorTextZoneRelegation]: '#991b1b',
    [colorBgRowAlt]: '#f3f4f6',
    [colorBgTableHeader]: '#6b7280',

    [colorFocus]: '#3b82f6',
    [colorFocusRing]: 'rgba(59, 130, 246, 0.2)',

    [fontFamily]:
      'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',

    [fontSizeXs]: '11px',
    [fontSizeSm]: '12px',
    [fontSizeBase]: '14px',
    [fontSizeMd]: '15px',
    [fontSizeLg]: '18px',
    [fontSizeXl]: '28px',

    [space1]: '4px',
    [space2]: '8px',
    [space3]: '12px',
    [space4]: '16px',
    [space6]: '24px',
    [space8]: '32px',
    [space12]: '48px',

    [radiusSm]: '3px',
    [radiusMd]: '4px',
    [radiusLg]: '6px',

    [shadowSm]: '0 1px 3px rgba(0, 0, 0, 0.1)',
    [shadowMd]: '0 2px 6px rgba(0, 0, 0, 0.1)',

    [maxWidthContent]: '1400px',
  },
});
