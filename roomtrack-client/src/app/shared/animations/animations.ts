import {
  trigger,
  transition,
  style,
  animate,
  query,
  group,
  stagger,
  sequence,
} from '@angular/animations';

export const enhancedPageAnimation = trigger('enhancedPageAnimation', [
  // Transition between any state
  transition('* <=> *', [
    // Configure both incoming and outgoing pages
    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }),
      ],
      { optional: true }
    ),

    // Coordinated entry and exit animation
    group([
      // Exit animation
      query(
        ':leave',
        [
          style({
            opacity: 1,
            transform: 'scale(1)',
            filter: 'blur(0px)',
          }),
          animate(
            '400ms cubic-bezier(0.4, 0.0, 0.2, 1)',
            style({
              opacity: 0,
              transform: 'scale(0.98) translateY(10px)',
              filter: 'blur(2px)',
              zIndex: 1,
            })
          ),
        ],
        { optional: true }
      ),

      // Input animation with sequence for child elements
      query(
        ':enter',
        [
          style({
            opacity: 0,
            transform: 'scale(1.02) translateY(-10px)',
            filter: 'blur(4px)',
            zIndex: 2,
          }),
          animate(
            '500ms 100ms cubic-bezier(0.2, 0.8, 0.4, 1)',
            style({
              opacity: 1,
              transform: 'scale(1) translateY(0)',
              filter: 'blur(0px)',
            })
          ),

          // Sequential animation for child elements (optional)
          query(
            '.animate-item',
            [
              style({ opacity: 0, transform: 'translateY(20px)' }),
              stagger(75, [
                animate(
                  '350ms cubic-bezier(0.35, 0, 0.25, 1)',
                  style({ opacity: 1, transform: 'translateY(0)' })
                ),
              ]),
            ],
            { optional: true }
          ),
        ],
        { optional: true }
      ),
    ]),
  ]),
]);

// Transition animation with directional slider effect
export const slideAnimation = trigger('slideAnimation', [
  transition('home => *', [
    // From home to any page
    group([
      query(':enter, :leave', style({ position: 'absolute', width: '100%' }), {
        optional: true,
      }),
      query(
        ':leave',
        [
          style({ transform: 'translateX(0)' }),
          animate(
            '500ms cubic-bezier(0.33, 1, 0.68, 1)',
            style({ transform: 'translateX(-100%)', opacity: 0 })
          ),
        ],
        { optional: true }
      ),
      query(
        ':enter',
        [
          style({ transform: 'translateX(100%)', opacity: 0.5 }),
          animate(
            '500ms cubic-bezier(0.33, 1, 0.68, 1)',
            style({ transform: 'translateX(0)', opacity: 1 })
          ),
        ],
        { optional: true }
      ),
    ]),
  ]),

  transition('* => home', [
    // Go to home from any page
    group([
      query(':enter, :leave', style({ position: 'absolute', width: '100%' }), {
        optional: true,
      }),
      query(
        ':leave',
        [
          style({ transform: 'translateX(0)' }),
          animate(
            '500ms cubic-bezier(0.33, 1, 0.68, 1)',
            style({ transform: 'translateX(100%)', opacity: 0 })
          ),
        ],
        { optional: true }
      ),
      query(
        ':enter',
        [
          style({ transform: 'translateX(-100%)', opacity: 0.5 }),
          animate(
            '500ms cubic-bezier(0.33, 1, 0.68, 1)',
            style({ transform: 'translateX(0)', opacity: 1 })
          ),
        ],
        { optional: true }
      ),
    ]),
  ]),

  transition('* <=> *', [
    // Generic transition between other pages
    group([
      query(':enter, :leave', style({ position: 'absolute', width: '100%' }), {
        optional: true,
      }),
      query(
        ':leave',
        [
          style({ transform: 'translateX(0) scale(1)', opacity: 1 }),
          animate(
            '400ms cubic-bezier(0.33, 1, 0.68, 1)',
            style({
              transform: 'translateX(-5%) scale(0.98)',
              opacity: 0,
              filter: 'brightness(1.1) blur(2px)',
            })
          ),
        ],
        { optional: true }
      ),
      query(
        ':enter',
        [
          style({
            transform: 'translateX(5%) scale(0.98)',
            opacity: 0,
            filter: 'brightness(1.1) blur(2px)',
          }),
          animate(
            '500ms 50ms cubic-bezier(0.33, 1, 0.68, 1)',
            style({
              transform: 'translateX(0) scale(1)',
              opacity: 1,
              filter: 'brightness(1) blur(0)',
            })
          ),
        ],
        { optional: true }
      ),
    ]),
  ]),
]);

// 3D animation with perspective
export const perspectiveAnimation = trigger('perspectiveAnimation', [
  transition('* <=> *', [
    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backfaceVisibility: 'hidden',
        }),
      ],
      { optional: true }
    ),

    group([
      query(
        ':leave',
        [
          style({
            transform: 'perspective(1200px) rotateY(0deg)',
            transformOrigin: 'center left',
            opacity: 1,
          }),
          animate(
            '600ms cubic-bezier(0.4, 0, 0.2, 1)',
            style({
              transform: 'perspective(1200px) rotateY(-15deg)',
              opacity: 0,
              zIndex: 1,
            })
          ),
        ],
        { optional: true }
      ),

      query(
        ':enter',
        [
          style({
            transform: 'perspective(1200px) rotateY(15deg)',
            transformOrigin: 'center right',
            opacity: 0,
            zIndex: 2,
          }),
          animate(
            '600ms 100ms cubic-bezier(0.4, 0, 0.2, 1)',
            style({
              transform: 'perspective(1200px) rotateY(0deg)',
              opacity: 1,
            })
          ),
        ],
        { optional: true }
      ),
    ]),
  ]),
]);

export const dropdownAnimation = trigger('dropdownAnimation', [
  transition(':enter', [
    style({
      opacity: 0,
      transform: 'translateY(-20px)',
      height: 0
    }),
    animate('200ms ease-out', style({
      opacity: 1,
      transform: 'translateY(0)',
      height: '*'
    }))
  ]),
  transition(':leave', [
    style({
      opacity: 1,
      transform: 'translateY(0)',
      height: '*'
    }),
    animate('200ms ease-in', style({
      opacity: 0,
      transform: 'translateY(-20px)',
      height: 0
    }))
  ])
]);
