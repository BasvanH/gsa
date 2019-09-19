/* Copyright (C) 2019 Greenbone Networks GmbH
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
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

import Filter from 'gmp/models/filter';

import {loadingActions} from 'web/store/usersettings/defaults/actions';
import {defaultFilterLoadingActions} from 'web/store/usersettings/defaultfilters/actions';
import {pageFilter} from 'web/store/pages/actions';

import {rendererWith, waitForElement} from 'web/utils/testing';

import FilterProvider, {DEFAULT_FALLBACK_FILTER} from '../filterprovider';

describe('FilterProvider component tests', () => {
  test('should return locationQuery filter', async () => {
    // if FilterProvider gets a locationQuery as prop, use its filter
    const resultingFilter = Filter.fromString('location=query rows=42');

    const locationQuery = {filter: 'location=query'};

    const defaultSettingfilter = Filter.fromString('foo=bar');

    const getSetting = jest.fn().mockResolvedValue({});
    const gmp = {
      user: {
        getSetting,
      },
    };

    const {render, store} = rendererWith({
      gmp,
      store: true,
      router: true,
    });

    store.dispatch(loadingActions.success({rowsperpage: {value: '42'}}));
    store.dispatch(
      defaultFilterLoadingActions.success('task', defaultSettingfilter),
    );

    const renderFunc = jest.fn().mockReturnValue(<div />);

    const {baseElement, getByTestId} = render(
      <FilterProvider locationQuery={locationQuery} gmpname="task">
        {renderFunc}
      </FilterProvider>,
    );

    await waitForElement(() => getByTestId('awaiting-span'));

    expect(renderFunc).toHaveBeenCalledWith({filter: resultingFilter});
    expect(baseElement).toMatchSnapshot();
  });

  test('should return pageFilter', async () => {
    // if no query is given and a pageFilter exists, use that one
    const resultingFilter = Filter.fromString('page=filter rows=42');

    const pFilter = Filter.fromString('page=filter');

    const defaultSettingfilter = Filter.fromString('foo=bar');

    const getSetting = jest.fn().mockResolvedValue({});
    const gmp = {
      user: {
        getSetting,
      },
    };

    const {render, store} = rendererWith({
      gmp,
      store: true,
      router: true,
    });

    store.dispatch(loadingActions.success({rowsperpage: {value: '42'}}));
    store.dispatch(
      defaultFilterLoadingActions.success('task', defaultSettingfilter),
    );
    store.dispatch(pageFilter('task', pFilter));

    const renderFunc = jest.fn().mockReturnValue(<div />);

    const {baseElement, getByTestId} = render(
      <FilterProvider gmpname="task">{renderFunc}</FilterProvider>,
    );

    await waitForElement(() => getByTestId('awaiting-span'));

    expect(renderFunc).toHaveBeenCalledWith({filter: resultingFilter});
    expect(baseElement).toMatchSnapshot();
  });

  test('should return defaultSettingFilter', async () => {
    // if no pageFilter exists use the user default from the usersettings
    const resultingFilter = Filter.fromString('foo=bar rows=42');

    const defaultSettingfilter = Filter.fromString('foo=bar');

    const getSetting = jest.fn().mockResolvedValue({});
    const gmp = {
      user: {
        getSetting,
      },
    };

    const {render, store} = rendererWith({
      gmp,
      store: true,
      router: true,
    });

    store.dispatch(loadingActions.success({rowsperpage: {value: '42'}}));
    store.dispatch(
      defaultFilterLoadingActions.success('task', defaultSettingfilter),
    );

    const renderFunc = jest.fn().mockReturnValue(<div />);

    const {baseElement, getByTestId} = render(
      <FilterProvider gmpname="task">{renderFunc}</FilterProvider>,
    );

    await waitForElement(() => getByTestId('awaiting-span'));

    expect(renderFunc).toHaveBeenCalledWith({filter: resultingFilter});
    expect(baseElement).toMatchSnapshot();
  });

  test('should return fallbackFilter if given', async () => {
    // if no usersettings defaultFilter exists use the given fallbackFilter
    const resultingFilter = Filter.fromString('fall=back rows=42');

    const fallbackFilter = Filter.fromString('fall=back');

    const getSetting = jest.fn().mockResolvedValue({});
    const subscribe = jest.fn();
    const gmp = {
      user: {
        getSetting,
      },
    };

    const {render, store} = rendererWith({
      gmp,
      store: true,
      router: true,
    });

    store.subscribe(subscribe);

    store.dispatch(loadingActions.success({rowsperpage: {value: '42'}}));

    const renderFunc = jest.fn().mockReturnValue(<div />);

    const {baseElement, getByTestId} = render(
      <FilterProvider gmpname="task" fallbackFilter={fallbackFilter}>
        {renderFunc}
      </FilterProvider>,
    );

    await waitForElement(() => getByTestId('awaiting-span'));

    expect(renderFunc).toHaveBeenCalledWith({filter: resultingFilter});
    expect(baseElement).toMatchSnapshot();
  });

  test('should return default fallbackFilter', async () => {
    // if no fallbackFilter is given use the default fallbackFilter
    const resultingFilter = DEFAULT_FALLBACK_FILTER.set('rows', 42);

    const getSetting = jest.fn().mockResolvedValue({});
    const subscribe = jest.fn();
    const gmp = {
      user: {
        getSetting,
      },
    };

    const {render, store} = rendererWith({
      gmp,
      store: true,
      router: true,
    });

    store.subscribe(subscribe);

    store.dispatch(loadingActions.success({rowsperpage: {value: '42'}}));

    const renderFunc = jest.fn().mockReturnValue(<div />);

    const {baseElement, getByTestId} = render(
      <FilterProvider gmpname="task">{renderFunc}</FilterProvider>,
    );

    await waitForElement(() => getByTestId('awaiting-span'));

    expect(renderFunc).toHaveBeenCalledWith({filter: resultingFilter});
    expect(baseElement).toMatchSnapshot();
  });

  test('should not overwrite rows keyword', async () => {
    // if rows= is set already, don't overwrite it. FilterProvider makes sure
    // that rows is always set to the usersettings rowsperpage.value
    const resultingFilter = Filter.fromString('fall=back rows=21');
    // use fallbackFilter as sample
    const fallbackFilter = Filter.fromString('fall=back rows=21');

    const getSetting = jest.fn().mockResolvedValue({});
    const subscribe = jest.fn();
    const gmp = {
      user: {
        getSetting,
      },
    };

    const {render, store} = rendererWith({
      gmp,
      store: true,
      router: true,
    });

    store.subscribe(subscribe);

    store.dispatch(loadingActions.success({rowsperpage: {value: '42'}}));

    const renderFunc = jest.fn().mockReturnValue(<div />);

    const {baseElement, getByTestId} = render(
      <FilterProvider fallbackFilter={fallbackFilter} gmpname="task">
        {renderFunc}
      </FilterProvider>,
    );

    await waitForElement(() => getByTestId('awaiting-span'));

    expect(renderFunc).toHaveBeenCalledWith({filter: resultingFilter});
    expect(baseElement).toMatchSnapshot();
  });
});
