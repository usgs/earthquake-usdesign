'use strict';

var Section = require('renderer/Section'),

    Formatter = require('util/Formatter'),

    Util = require('util/Util');


var _DEFAULTS = {
  classes: ['section-11-4-1'],
  nodeType: 'section',
  baseUrl: 'http://earthquake.usgs.gov/hazards/designmaps/pdfs',
  // 1 = Alaska,
  // 2 = American Samoa,
  // 3 = Guam,
  // 4 = Hawaii,
  // 5 = Puerto Rico and Virgin Islands,
  // 6 = Conterminous US
  figures: {
    // Alaska
    1: [
      {
        'pdf': 'Figure22-3.pdf',
        'text': 'FIGURE 22-3 S<sub>S</sub> Risk-Targeted Maximum Considered ' +
                'Earthquake (MCE<sub>R</sub>) Ground Motion Parameter for ' +
                'Alaska for 0.2 s Spectral Response Acceleration (5% of ' +
                'Critical Damping), Site Class B.'
      },
      {
        'pdf': 'Figure22-4.pdf',
        'text': 'FIGURE 22-4 S<sub>1</sub> Risk-Targeted Maximum Considered ' +
                'Earthquake (MCE<sub>R</sub>) Ground Motion Parameter for ' +
                'Alaska for 1.0 s Spectral Response Acceleration (5% of ' +
                'Critical Damping), Site Class B.'
      },
      {
        'pdf': 'Figure22-10.pdf',
        'text': 'FIGURE 22-10 Maximum Considered Earthquake Geometric Mean ' +
                '(MCE<sub>G</sub>) PGA, %g, Site Class B for Alaska.'
      },
      {
        'pdf': 'Figure22-15.pdf',
        'text': 'FIGURE 22-15 Mapped Long-Period Transition Period, ' +
                'T<sub>L</sub> (s), for Alaska.'
      },
      {
        'pdf': 'Figure22-18.pdf',
        'text': 'FIGURE 22-18 Mapped Risk Coefficient at 0.2 s Spectral ' +
                'Response Period, C<sub>RS</sub>.'
      },
      {
        'pdf': 'Figure22-19.pdf',
        'text': 'FIGURE 22-19 Mapped Risk Coefficient at 1.0 s Spectral ' +
                'Response Period, C<sub>R1</sub>'
      }
    ],
    // American Samoa
    2: [
      {
        'pdf': 'Figure22-8.pdf',
        'text': 'FIGURE 22-8 S<sub>S</sub> and S<sub>1</sub> Risk-Targeted ' +
                'Maximum Considered Earthquake (MCE<sub>R</sub>) Ground ' +
                'Motion Parameter for American Samoa for 0.2 and 1.0 s ' +
                'Spectral Response Acceleration (5% of Critical Damping), ' +
                'Site Class B.'
      },
      {
        'pdf': 'Figure22-13.pdf',
        'text': 'FIGURE 22-13 Maximum Considered Earthquake Geometric Mean ' +
                '(MCEG) PGA, %g, Site Class B for Guam and the Northern ' +
                'Mariana Islands and for American Samoa.'
      },
      {
        'pdf': 'Figure22-18.pdf',
        'text': 'FIGURE 22-18 Mapped Risk Coefficient at 0.2 s Spectral ' +
                'Response Period, C<sub>RS</sub>.'
      },
      {
        'pdf': 'Figure22-19.pdf',
        'text': 'FIGURE 22-19 Mapped Risk Coefficient at 1.0 s Spectral ' +
                'Response Period, C<sub>R1</sub>'
      }
    ],
    // Guam
    3: [
      {
        'pdf': 'Figure22-7.pdf',
        'text': 'FIGURE 22-7 S<sub>S</sub> and S<sub>1</sub> Risk-Targeted ' +
                'Maximum Considered Earthquake (MCE<sub>R</sub>) Ground ' +
                'Motion Parameter for Guam and the Northern Mariana Islands ' +
                'for 0.2 and 1.0 s Spectral Response Acceleration (5% of ' +
                'Critical Damping), Site Class B.'
      },
      {
        'pdf': 'Figure22-13.pdf',
        'text': 'FIGURE 22-13 Maximum Considered Earthquake Geometric Mean ' +
                '(MCEG) PGA, %g, Site Class B for Guam and the Northern ' +
                'Mariana Islands and for American Samoa.'
      },
      {
        'pdf': 'Figure22-18.pdf',
        'text': 'FIGURE 22-18 Mapped Risk Coefficient at 0.2 s Spectral ' +
                'Response Period, C<sub>RS</sub>.'
      },
      {
        'pdf': 'Figure22-19.pdf',
        'text': 'FIGURE 22-19 Mapped Risk Coefficient at 1.0 s Spectral ' +
                'Response Period, C<sub>R1</sub>'
      }
    ],
    // Hawaii
    4: [
      {
        'pdf': 'Figure22-5.pdf',
        'text': 'FIGURE 22-5 S<sub>S</sub> and S<sub>1</sub> Risk-Targeted ' +
                'Maximum Considered Earthquake (MCE<sub>R</sub>) Ground ' +
                'Motion Parameter for Hawaii for 0.2 and 1.0 s Spectral ' +
                'Response Acceleration (5% of Critical Damping), Site Class B.'
      },
      {
        'pdf': 'Figure22-11.pdf',
        'text': 'FIGURE 22-11 Maximum Considered Earthquake Geometric Mean ' +
                '(MCE<sub>G</sub>) PGA, %g, Site Class B for Hawaii. '
      },
      {
        'pdf': 'Figure22-16.pdf',
        'text': 'FIGURE 22-16 Mapped Long-Period Transition Period, ' +
                'T<sub>L</sub> (s), for Hawaii.'
      },
      {
        'pdf': 'Figure22-18.pdf',
        'text': 'FIGURE 22-18 Mapped Risk Coefficient at 0.2 s Spectral ' +
                'Response Period, C<sub>RS</sub>.'
      },
      {
        'pdf': 'Figure22-19.pdf',
        'text': 'FIGURE 22-19 Mapped Risk Coefficient at 1.0 s Spectral ' +
                'Response Period, C<sub>R1</sub>'
      }
    ],
    // Puerto Rico
    5: [
      {
        'pdf': 'Figure22-6.pdf',
        'text': 'FIGURE 22-6 S<sub>S</sub> and S<sub>1</sub> Risk-Targeted ' +
                'Maximum Considered Earthquake (MCE<sub>R</sub>) Ground ' +
                'Motion Parameter for Puerto Rico and the Unites States ' +
                'Virgin Islands for 0.2 and 1.0 s Spectral Response ' +
                'Acceleration (5% of Critical Damping), Site Class B.'
      },
      {
        'pdf': 'Figure22-12.pdf',
        'text': 'FIGURE 22-12 Maximum Considered Earthquake Geometric Mean ' +
                '(MCEG) PGA, %g, Site Class B for Puerto Rico and the Unites ' +
                'States Virgin Islands'
      },
      {
        'pdf': 'Figure22-17.pdf',
        'text': 'FIGURE 22-17 Mapped Long-Period Transition Period, ' +
                'T<sub>L</sub> (s), for Puerto Rico and the United States ' +
                'Virgin Islands.'
      },
      {
        'pdf': 'Figure22-18.pdf',
        'text': 'FIGURE 22-18 Mapped Risk Coefficient at 0.2 s Spectral ' +
                'Response Period, C<sub>RS</sub>.'
      },
      {
        'pdf': 'Figure22-19.pdf',
        'text': 'FIGURE 22-19 Mapped Risk Coefficient at 1.0 s Spectral ' +
                'Response Period, C<sub>R1</sub>'
      }
    ],
    // Conterminous US
    6: [
      {
        'pdf': 'Figure22-1.pdf',
        'text': 'FIGURE 22-1 S<sub>S</sub> Risk-Targeted Maximum Considered ' +
                'Earthquake (MCE<sub>R</sub>) Ground Motion Parameter for ' +
                'the Conterminous United States for 0.2 s Spectral Response ' +
                'Acceleration (5% of Critical Damping), Site Class B.'
      },
      {
        'pdf': 'Figure22-2.pdf',
        'text': 'FIGURE 22-2 S<sub>1</sub> Risk-Targeted Maximum Considered ' +
                'Earthquake (MCE<sub>R</sub>) Ground Motion Parameter for ' +
                'the Conterminous United States for 1.0 s Spectral Response ' +
                'Acceleration (5% of Critical Damping), Site Class B.'
      },
      {
        'pdf': 'Figure22-9.pdf',
        'text': 'FIGURE 22-9 Maximum Considered Earthquake Geometric Mean ' +
                '(MCE<sub>G</sub>) PGA, %g, Site Class B for the ' +
                'Conterminous United States.'
      },
      {
        'pdf': 'Figure22-14.pdf',
        'text': 'FIGURE 22-14 Mapped Long-Period Transition Period, ' +
                'T<sub>L</sub> (s), for the Conterminous United States.'
      },
      {
        'pdf': 'Figure22-18.pdf',
        'text': 'FIGURE 22-18 Mapped Risk Coefficient at 0.2 s Spectral ' +
                'Response Period, C<sub>RS</sub>.'
      },
      {
        'pdf': 'Figure22-19.pdf',
        'text': 'FIGURE 22-19 Mapped Risk Coefficient at 1.0 s Spectral ' +
                'Response Period, C<sub>R1</sub>'
      }
    ]
  }
};


var Nehrp2015Section_Section_11_4_1 = function (params) {
  var _this,
      _initialize,

      _baseUrl,
      _figures,

      _getFigures;


  params = Util.extend({}, _DEFAULTS, params);
  _this = Section(params);

  _initialize = function (params) {
    _baseUrl = params.baseUrl;
    _figures = params.figures;
  };

  _getFigures = function (region) {
    var figures,
        markup;

    figures = Array();
    figures = _figures[region];
    markup = Array();

    for (var i = 0; i < figures.length; i++) {
      markup[i] = '<li><a href="' + _baseUrl + '/' + figures[i].pdf +
          '" target="_blank">' + figures[i].text + '</a></li>';
    }

    return markup.join('');
  };

  _this.getSection = Util.compose(_this.getSection, function (args) {
    var metadata,
        output,
        region,
        section;

    output = args.model.get('output');
    section = args.section;

    metadata = output.get('metadata');
    region = metadata.get('region_id');

    section.innerHTML = [
      '<h3>',
        'Mapped Acceleration Parameters, Long-Period Transition Periods, and ',
        'Risk Coefficients',
      '</h3>',
      '<p>',
        'Note: The S<sub>S</sub> and S<sub>1</sub> ground motion maps ',
        'provided below are for the direction of maximmum horizontal spectral ',
        'response acceleration. They have been converted from corresponding ',
        'geometric mean ground motions computed by the USGS by applying ',
        'factors of ',
          Formatter.number(metadata.get('max_direction_ss'), 1),
        ' (to obtain S<sub>S</sub>) ',
          Formatter.number(metadata.get('max_direction_s1'), 1),
        ' (to obtain S<sub>1</sub>).',
      '</p>',
      '<ul class="figures">',
        _getFigures(region),
      '</ul>'
    ].join('');

    return args;
  });


  _initialize(params);
  params = null;
  return _this;
};

module.exports = Nehrp2015Section_Section_11_4_1;
