/* Greenbone Security Assistant
 *
 * Authors:
 * Steffen Waterkamp <steffen.waterkamp@greenbone.net>
 *
 * Copyright:
 * Copyright (C) 2018 Greenbone Networks GmbH
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 */

import React from 'react';

import _ from 'gmp/locale';

import PropTypes from '../../../utils/proptypes';

import CvssDisplay from '../../../components/dashboard2/display/cvssdisplay';

import {VulnsSeverityLoader} from './loaders';

const VulnsSeverityDisplay = ({
  filter,
  ...props
}) => (
  <VulnsSeverityLoader
    filter={filter}
  >
    {({data}) => (
      <CvssDisplay
        {...props}
        data={data}
        title={({data: tdata}) =>
          _('Vulnerabilities by CVSS (Total: {{count}})',
            {count: tdata.total})}
      />
    )}
  </VulnsSeverityLoader>
);

VulnsSeverityDisplay.propTypes = {
  filter: PropTypes.filter,
};

export default VulnsSeverityDisplay;

// vim: set ts=2 sw=2 tw=80: