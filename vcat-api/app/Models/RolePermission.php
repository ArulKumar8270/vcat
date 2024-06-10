<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RolePermission extends Model
{
    use SoftDeletes;
    protected $fillable = ['role_id', 'permission_id', 'created_by', 'modified_by', 'is_deleted'];

    public function getRoles()
    {
        return $this->hasMany(Role::class);
    }

    public function getPermissions()
    {
        return $this->hasMany(Permission::class);
    }
}
