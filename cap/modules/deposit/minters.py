# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2018 CERN.
#
# CERN Analysis Preservation Framework is free software; you can redistribute
# it and/or modify it under the terms of the GNU General Public License as
# published by the Free Software Foundation; either version 2 of the
# License, or (at your option) any later version.
#
# CERN Analysis Preservation Framework is distributed in the hope that it will
# be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
# General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with CERN Analysis Preservation Framework; if not, write to the
# Free Software Foundation, Inc., 59 Temple Place, Suite 330, Boston,
# MA 02111-1307, USA.
#
# In applying this license, CERN does not
# waive the privileges and immunities granted to it by virtue of its status
# as an Intergovernmental Organization or submit itself to any jurisdiction.
# or submit itself to any jurisdiction.
"""PID minters for drafts."""

from __future__ import absolute_import, print_function

import uuid

from invenio_pidstore.models import PersistentIdentifier, PIDStatus

from cap.modules.schemas.resolvers import (
    resolve_schema_by_name_and_version,
    resolve_schema_by_url,
)

from .utils import generate_auto_incremental_pid, set_copy_to_attr


def cap_deposit_minter(record_uuid, data, schema=None):
    """Mint deposit's identifier."""
    try:
        pid_value = data['_deposit']['id']
    except KeyError:
        pid_value, schema = None, None
        if not schema:
            if data.get('$ana_type'):
                schema = resolve_schema_by_name_and_version(
                    data.get('$ana_type')
                )
            elif data.get('$schema'):
                schema = resolve_schema_by_url(data.get('$schema'))

        if schema:
            pid_config = schema.config.get("pid", {})
            pid_format = pid_config.get('format')
            if pid_format:
                pid_value = generate_auto_incremental_pid(pid_format)
        if not pid_value:
            pid_value = uuid.uuid4().hex

        if schema:
            copy_to_attr = pid_config.get('copy_to')
            if copy_to_attr:
                copy_to_attr_dict = set_copy_to_attr(pid_value, copy_to_attr)
                data.update(copy_to_attr_dict)

    pid = PersistentIdentifier.create(
        'depid',
        pid_value,
        object_type='rec',
        object_uuid=record_uuid,
        status=PIDStatus.REGISTERED,
    )

    data['_deposit'] = {
        'id': pid.pid_value,
        'status': 'draft',
    }

    return pid
